import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type SetAppliedQueryFunction = (querry: string) => void;

function debounce(
  setAppliedQuerry: SetAppliedQueryFunction,
  delay: number,
) {
  let timerId = 0;

  return (querry: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      setAppliedQuerry(querry);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeople = useMemo<Person[]>(() => {
    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setIsFocused(false);
    setQuery(newQuery);
    applyQuery(newQuery);
    setTimeout(() => setIsFocused(true), 2000);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    applyQuery(person.name);
    setSelectedPerson(person);
  };

  const handleClearPerson = () => {
    setSelectedPerson(null);
    setQuery('');
    setAppliedQuery('');
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100);
  };

  return (
    <main className="section">
      <h1 className="title">
        {(selectedPerson && query.trim() === selectedPerson.name) ? (
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
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />

          {selectedPerson && query && (
            <button
              type="submit"
              className="button is-danger is-outlined"
              onClick={handleClearPerson}
            >
              <span>Clear</span>
            </button>
          )}
        </div>

        <div
          id="dropdown-menu"
          className="dropdown-menu"
          role="menu"
        >
          {isFocused && filteredPeople.length > 0 && (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <a
                  key={person.slug}
                  href="#select"
                  className="dropdown-item"
                  onClick={(event) => handleSelectedPerson(event, person)}
                >
                  {person.name}
                </a>
              ))}
            </div>
          )}

          {isFocused && filteredPeople.length === 0 && (
            <div className="dropdown-content">
              <div className="dropdown-item">
                No matching suggestions
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
