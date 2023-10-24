import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    if (!appliedQuery.startsWith(' ')) {
      return peopleFromServer
        .filter(person => person.name.toLowerCase()
          .includes(appliedQuery.toLowerCase()));
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsFocused(false);
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>

        {isFocused && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0
                ? (filteredPeople.map(person => (
                  <button
                    type="button"
                    className="dropdown-item"
                    key={person.slug}
                    onClick={() => onSelected(person)}
                  >
                    <p
                      className="has-text-link"
                    >
                      {person.name}
                    </p>
                  </button>
                )))
                : <div className="dropdown-item">No matching suggestions</div>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
