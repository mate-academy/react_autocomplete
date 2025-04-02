import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  setAppliedQuery: (query: string) => void;
  onSelected: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = React.memo(
  ({ people, delay = 300, setAppliedQuery, onSelected }) => {
    const [query, setQuery] = useState('');
    const [isDropDown, setIsDropDown] = useState(false);

    const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);
    const hideDropdown = useCallback(debounce(setIsDropDown, delay), [delay]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setQuery(value);
        onSelected(null);
        applyQuery(value.trim());
      },
      [],
    );

    const handleSelect = useCallback((person: Person) => {
      setQuery(person.name);
      setAppliedQuery(person.name);
      onSelected(person);
    }, []);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsDropDown(true)}
            onBlur={() => hideDropdown(false)}
          />
        </div>

        {isDropDown && people.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
