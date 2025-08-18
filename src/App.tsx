import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [menuView, setMenuView] = useState(false);
  const [query, setQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const filteredPeople = peopleFromServer.filter(person =>
    person.name.includes(filterQuery),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuView(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const applyQuery = useCallback(debounce(setFilterQuery, delay), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setQuery(event.target.value.trim());
    applyQuery(event.target.value.trim());
  };

  const createHandleClick = (person: Person) => {
    return () => {
      setSelectedPerson(
        filteredPeople.find(filtPerson => filtPerson.slug === person.slug) ||
          null,
      );
      setMenuView(false);
    };
  };

  const isEmpty = filteredPeople.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active" ref={menuRef}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              data-cy="search-input"
              onFocus={() => setMenuView(true)}
              onChange={handleChange}
            />
          </div>

          {menuView && !isEmpty && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={createHandleClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isEmpty && (
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
