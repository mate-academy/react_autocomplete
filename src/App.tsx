import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC<{
  delay?: number;
  onSelected?: (person: Person) => void;
}> = ({ delay = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();

  const [query, setQuery] = useState<string>('');
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const updateSelected = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    onSelected?.(person);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = query.trim();

      if (trimmed) {
        const filtered = peopleFromServer.filter(people =>
          people.name.toLowerCase().includes(trimmed.toLowerCase()),
        );

        setPeopleList(filtered);
        setIsNotFound(filtered.length === 0);
      } else {
        setPeopleList(peopleFromServer);
      }
    }, delay);

    return () => clearTimeout(timeout);
    //Add delay to the dependency array for when the delay prop changes.
  }, [query, delay]);

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
              onChange={event => {
                setQuery(event.target.value);
                if (selectedPerson) {
                  setSelectedPerson(undefined);
                }
              }}
              onFocus={() => setShowMenu(true)}
              onBlur={() => setShowMenu(false)}
            />
          </div>

          {showMenu && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {peopleList.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onMouseDown={() => {
                      updateSelected(person);
                      setShowMenu(false);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isNotFound && (
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
