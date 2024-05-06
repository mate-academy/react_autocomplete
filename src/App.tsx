import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const DELAY = 300;

export const App: React.FC = () => {
  const defaultList = [...peopleFromServer];
  const [list, setList] = useState<Person[]>(defaultList);
  const [query, setQuery] = useState('');
  const [applayedQuery, setApplayedQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedUser(null);
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setApplayedQuery(event.target.value);
    }, DELAY);
  };

  const handleFocus = () => {
    setList(defaultList);
    setFocused(true);
    setSelectedUser(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setList([]);
    }, 200);
  };

  const handleSelectedUser = (user: Person) => {
    setSelectedUser(user);
    setFocused(false);
    setQuery('');
  };

  const filteredList = useMemo(() => {
    return list.filter(item =>
      item.name.toLowerCase().includes(applayedQuery.trim().toLowerCase()),
    );
  }, [applayedQuery, list]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
            : `No selected person`}
        </h1>

        <div className={`dropdown ${focused && 'is-active'}`}>
          <div className="dropdown-trigger">
            <input
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
            {filteredList.length > 0 && (
              <div
                className="dropdown-menu"
                role="menu"
                data-cy="suggestions-list"
              >
                <div className="dropdown-content">
                  {filteredList.map(person => {
                    return (
                      <div
                        className="dropdown-item"
                        data-cy="suggestion-item"
                        key={person.slug}
                        onClick={() => handleSelectedUser(person)}
                      >
                        {person.sex === 'm' ? (
                          <p className="has-text-link">{person.name}</p>
                        ) : (
                          <p className="has-text-danger">{person.name}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {filteredList.length === 0 && query && (
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
          </div>
        </div>
      </main>
    </div>
  );
};
