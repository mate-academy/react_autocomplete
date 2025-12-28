import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { Notification } from './Notification';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onInputChange: () => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  onInputChange,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const trimmedValue = value.trim();

    setQuery(value);

    if (trimmedValue === '') {
      applyQuery('');
    } else {
      applyQuery(trimmedValue);
    }

    onInputChange();
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsFocused(false);
    onSelected(person);
  };

  const filteredPeople = useMemo(
    () =>
      [...people].filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [people, appliedQuery],
  );

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length === 0 && appliedQuery !== '' ? (
            <Notification />
          ) : (
            filteredPeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
