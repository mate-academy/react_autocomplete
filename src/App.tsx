import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people] = useState(peopleFromServer);
  const [hasClick, setHasClick] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
    setHasClick(value.length > 0);
  };

  const handleNameSelect = (person: Person) => {
    setSelectedPerson(person);
    setHasClick(false);
    setQuery('');
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
            onClick={() => setHasClick(query.length > 0)}
          />
        </div>

        {hasClick && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    onClick={() => handleNameSelect(person)}
                    className="dropdown-item"
                    key={person.slug}
                  >
                    <p className="has-text-link">{person.name}</p>
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
