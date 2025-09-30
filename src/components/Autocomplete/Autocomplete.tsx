import React, { useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (value: string | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => {},
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [searchByName, setSearchByName] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const applyQuery = useMemo(
    () => debounce(setSearchQuery, delay),
    [setSearchQuery, delay],
  );

  const filterList = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, people]);

  const handleChangeUser = (name: string) => {
    setInputValue(name);
    onSelected(name);
    setSearchByName(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(null);
    const newValue = event.target.value;

    setInputValue(newValue);
    applyQuery(newValue.trim());
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={inputValue}
          className="input"
          data-cy="search-input"
          onFocus={() => setSearchByName(true)}
          onChange={handleChange}
        />
      </div>
      {searchByName && people.length !== 0 && (
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {filterList.map(person => (
              <div
                className={classNames('dropdown-item', {
                  'is-active': person.name === inputValue,
                })}
                data-cy="suggestion-item"
                key={person.name}
                style={{ cursor: 'pointer' }}
                onClick={() => handleChangeUser(person.name)}
              >
                {person.name}
                <hr className="dropdown-divider" />
              </div>
            ))}
          </div>
        </div>
      )}

      {filterList.length === 0 && (
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
  );
};
