import React, { useState, useRef, useCallback } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { debounce } from './services/handleQueryChange';

function normalizeQuery(query: string) {
  return query.toLowerCase().trim();
}

const getFilteredPeople = (query: string) => {
  const filteredPeople = peopleFromServer
    .filter(person => normalizeQuery(person.name)
      .includes(normalizeQuery(query)));

  return filteredPeople;
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const refOfPost = useRef<HTMLInputElement | null>(null);
  const filteredPeople = getFilteredPeople(apliedQuery);
  const applyQuery = useCallback(debounce(setApliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputOnBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const handleButtonOnClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsFocused(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`)
          : ('No selected person')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleInputOnBlur}
            ref={refOfPost}
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <label className="dropdown-content">
            {(query === apliedQuery)
            && isFocused
            && filteredPeople.length > 0
            && (filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
              >
                <button
                  type="button"
                  id="button-id"
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={() => handleButtonOnClick(person)}
                >
                  {person.name}
                </button>
              </div>
            )))}
            {isFocused && !filteredPeople.length && (
              <p>No matching suggestions</p>
            )}
          </label>
        </div>
      </div>
    </main>
  );
};
