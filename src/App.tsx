import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';
import cn from 'classnames';
import '@fortawesome/fontawesome-free/css/all.css';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [hasError, setHasError] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filterUsers = useMemo(() => {
    const filteredUsers = peopleFromServer.filter(user =>
      user.name.toUpperCase().includes(appliedQuery.toUpperCase()),
    );

    setHasError(filteredUsers.length === 0);

    return filteredUsers;
  }, [appliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const handleInputFocus = () => {
    setIsDropdownActive(true);
  };

  const reset = () => {
    setQuery('');
    setSelectedPerson(null);
    setAppliedQuery('');
  };

  const handleUserSelect = (user: Person) => {
    setSelectedPerson(user);
    setQuery(user.name);
    setAppliedQuery(user.name);
    setIsDropdownActive(false);
  };

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div
          className={cn('dropdown', { 'is-active': isDropdownActive })}
          onMouseLeave={() => setIsDropdownActive(false)}
        >
          <div className="dropdown-trigger">
            <input
              value={query}
              onChange={handleChange}
              onFocus={handleInputFocus}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          {selectedPerson && (
            <button onClick={reset} className="button is-danger">
              <i className="fas fa-trash"></i>
            </button>
          )}

          <DropdownMenu users={filterUsers} onUserSelect={handleUserSelect} />
        </div>

        {hasError && (
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
