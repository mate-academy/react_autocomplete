import React, { useCallback, useState, useMemo } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase().includes(
      appliedQuery.toLowerCase(),
    ));
  }, [peopleFromServer, appliedQuery]);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEvent = event.target.value;

    setQuery(newEvent);
    applyQuery(newEvent);
    setIsDropdownVisible(newEvent.length > 0);
    setSelectedPerson(null);
  };

  const handleNameSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownVisible(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
            onClick={() => setIsDropdownVisible(query.length > 0)}
          />

        </div>

        {!selectedPerson && isDropdownVisible && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                  >
                    <button
                      type="button"
                      className="has-text-link"
                      onClick={() => handleNameSelect(person)}
                    >
                      {person.name}
                    </button>
                  </div>
                ))
              ) : (
                <div className="dropdown-item">
                  <p className="has-text-link">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
