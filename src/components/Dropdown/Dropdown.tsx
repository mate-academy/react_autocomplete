import React, { memo, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

interface Props {
  users: Person[];
  onSelected?: (person: Person | null) => void;
  onChange: (value: string) => void;
  delay?: number;
}

export const Dropdown: React.FC<Props> = memo(function Dropdown({
  users,
  onSelected: onSelect = () => {},
  onChange,
  delay = 300,
}) {
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState('');

  const handleSelect = (user: Person) => {
    onSelect(user);
    setSearch(user.name);
    setShowList(false);
  };

  const debounceChangeQuery = useMemo(
    () =>
      debounce((value: string) => {
        onChange(value.trim());
      }, delay),
    [onChange, delay],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const curValue = event.target.value;

    debounceChangeQuery(curValue);
    setSearch(curValue);
    onSelect(null);
  };

  return (
    <div
      className={classNames(`dropdown`, {
        'is-active': showList,
      })}
      onBlur={() => setShowList(false)}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={search}
          onChange={handleChange}
          onFocus={() => setShowList(true)}
        />
      </div>

      {showList && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {users.map(user => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={user.name}
                onMouseDown={() => handleSelect(user)}
              >
                <p className="has-text-link">{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
