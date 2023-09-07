import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  users: Person[];
  onSelect?: (user: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = React.memo(({
  users,
  onSelect = () => {},
  delay = 1000,
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query !== event.target.value) {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelect(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user: Person) => user
      .name.toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  }, [users, appliedQuery]);

  const onQueryInputFocus = useCallback(() => {
    setHasFocus(true);
  }, []);

  const onQueryInputBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  const onSelectUser = useCallback((user: Person) => {
    onSelect(user);
    setQuery(user.name);
    setHasFocus(false);
  }, []);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': hasFocus,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={onChangeQuery}
          onFocus={onQueryInputFocus}
          onBlur={onQueryInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {!filteredUsers.length
            ? filteredUsers.map(user => (
              <button
                type="button"
                className="dropdown-item"
                key={user.slug}
                onMouseDown={() => onSelectUser(user)}
              >
                <span
                  className={classNames({
                    'has-text-link': user.sex === 'm',
                    'has-text-danger': user.sex === 'f',
                  })}
                >
                  {user.name}
                </span>
              </button>
            ))
            : (
              <div className="dropdown-item" key="no-suggestion">
                <p className="has-text-link">No matching suggestions</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
});
