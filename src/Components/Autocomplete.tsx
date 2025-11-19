import React, { useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay: number;
  selectedUser: Person | null;
  onSelectedUser: (user: Person | null) => void;
};

// Dropdown

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  selectedUser,
  onSelectedUser = () => {},
}: Props) => {
  const timerId = useRef(0);
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [focused, setFocused] = useState(false);

  // helper functions
  const filteredUsers = useMemo(() => {
    if (selectedUser) {
      return [selectedUser];
    }

    if (!appliedQuery) {
      return people;
    }

    return people.filter((user: Person) => user.name.includes(appliedQuery));
  }, [appliedQuery, selectedUser, people]);

  function handleQurryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    onSelectedUser(null);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      const trimmed = event.target.value.trim();

      setAppliedQuery(trimmed);
    }, delay);
  }

  // build part

  return (
    <>
      <div className="dropdown-trigger">
        <input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={event => handleQurryChange(event)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      <div>
        {filteredUsers?.length > 0 && focused && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredUsers &&
                filteredUsers.map((person: Person) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={`${person.name}-${person.born}`}
                    onMouseDown={() => {
                      if (person.name) {
                        onSelectedUser(person);
                        setQuery(person.name);
                      }
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!filteredUsers?.length && (
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
    </>
  );
};
