import React, { useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface Props {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredUser =
    appliedQuery.length > 0 && appliedQuery.trim() === ''
      ? []
      : peopleFromServer.filter(user => user.name.includes(appliedQuery));

  const timerId = useRef(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setFocus(true);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChange}
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setFocus(false);
                }, 200);
              }}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            autoFocus
          >
            {focus && filteredUser.length !== 0 && (
              <div className="dropdown-content">
                {filteredUser.map(people => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={people.slug}
                    onClick={() => {
                      setQuery(people.name);
                      setSelectedPerson(people);

                      if (onSelected) {
                        onSelected(people);
                      }
                    }}
                  >
                    <p className="has-text-link">{people.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {appliedQuery.trim() !== '' && filteredUser.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
