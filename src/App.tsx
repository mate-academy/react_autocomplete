import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function debounce(
  setAppliedQuerry: (querry: string) => void,
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
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase().trim()));
  }, [appliedQuery]);

  const applyQuery = useCallback((querry: string) => {
    debounce(setAppliedQuery, 1000)(querry);
  }, []);

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
    setAppliedQuery(person.name);
    setSelectedPerson(person);
  };

  const handleClearPerson = () => {
    setSelectedPerson(null);
    setAppliedQuery('');
    setQuery('');
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
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
              className="button is-danger is-outline"
              onClick={handleClearPerson}
            >
              Clear
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
                  onClick={(element) => handleSelectedPerson(element, person)}
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
