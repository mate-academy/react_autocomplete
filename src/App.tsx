/* eslint-disable react/button-has-type */
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const initialPeople = peopleFromServer
  .map(person => ({
    ...person,
  }));

function debounce(setAppliedQuerry: any, delay: number) {
  let timerId = 0;

  return (querry: string) => {
    window.clearInterval(timerId);
    timerId = window.setTimeout(() => {
      setAppliedQuerry(querry);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [people, setPeople] = useState('');
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    return initialPeople.filter(person => person.name
      .toLowerCase()
      .includes(people.toLowerCase()));
  }, [people]);

  const applyQuerry = useCallback(debounce(setPeople, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuerry = event.target.value;

    setQuery(newQuerry);
    applyQuerry(newQuerry);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    setPeople(person.name);
    setSelectedPerson(person);
  };

  const handleClearPerson = () => {
    setPeople('');
    setQuery('');
    setSelectedPerson(null);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
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
            onBlur={handleBlur}
          />
          {selectedPerson && (
            <button
              className="button is-danger"
              onClick={handleClearPerson}
            >
              clear
            </button>
          )}
        </div>

        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
        >
          {isFocused && filteredPeople.length === 0 && (
            <div className="dropdown-content">
              <div className="dropdown-item">
                No matching suggestions
              </div>
            </div>
          )}
          {isFocused && filteredPeople.length > 0 && (
            <div className="dropdown-content">
              {filteredPeople.map((person) => (
                <a
                  href="#select"
                  className="dropdown-item"
                  key={person.slug}
                  onClick={(element) => handleSelectedPerson(element, person)}
                >
                  {person.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
