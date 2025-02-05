import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';

interface AppProps {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

interface Person {
  name: string;
  born: number;
  died: number;
  slug: string;
  sex: string;
  fatherName: string | null;
  motherName: string | null;
}

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetQuery = useCallback(debounce(setAppliedQuery, delay), [
    setAppliedQuery,
    delay,
  ]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    debouncedSetQuery(value);

    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
      onSelected?.(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setSelectedPerson(person);
    onSelected?.(person);
  };

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handlePersonSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
