import React, { useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSearch?: (value: string) => void;
  delay?: number;
  peopleId?: (value: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSearch = () => {},
  peopleId = () => {},
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [searchByName, setSearchByName] = useState(false);

  const applyQuery = useMemo(
    () => debounce(onSearch, delay),
    [onSearch, delay],
  );

  const handleChangeUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputValue(event.target.value);
    peopleId(event.target.value);
    setSearchByName(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
    applyQuery(newValue);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={inputValue}
            className="input"
            data-cy="search-input"
            onFocus={() => setSearchByName(true)}
            onChange={handleChange}
          />
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      {searchByName && people.length !== 0 && (
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          <select className="dropdown-content" onChange={handleChangeUser}>
            <option value="0" disabled>
              Select a person
            </option>
            {people.map(person => (
              <option
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                value={person.name}
              >
                {person.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {people.length === 0 && (
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
