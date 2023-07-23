import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonList } from './components/PersonList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');

  const applyDebounceQuery = useCallback(debounce(setDebounceQuery, 1000), []);

  const handleInputQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyDebounceQuery(event.target.value);
  };

  const filteringPersons = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(debounceQuery.toLowerCase()));
  }, [debounceQuery]);

  const handleSelectedPerson = useCallback(
    (event: React.MouseEvent, person: Person) => {
      event.preventDefault();

      setQuery('');
      setDebounceQuery('');
      setSelectedPerson(person);
    }, [],
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson === null ? (
          'No selected person'
        ) : (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            onChange={handleInputQuery}
            value={query}
            className="input"
          />
        </div>
        {query === debounceQuery && query !== '' && debounceQuery !== '' && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteringPersons.length > 0 ? (
                debounceQuery && (
                  <PersonList
                    persons={filteringPersons}
                    handleSelectedPerson={handleSelectedPerson}
                  />
                )
              ) : (
                <p className="dropdown-item has-text-danger">
                  No matching suggestions
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
