import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

import { peopleFromServer } from '../../data/people';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = React.memo(({ onSelected, delay }) => {
  const [value, setValue] = useState('');
  const [appliedValue, setAppliedValue] = useState('');
  const [focus, setFocus] = useState(false);

  const applyValue = useCallback(debounce(setAppliedValue, delay), []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    applyValue(event.target.value);
    onSelected(null);
  };

  const handleOnClick = (person: Person) => {
    onSelected(person);
    setValue(person.name);
    setFocus(false);
  };

  const closeDropdown = () => {
    setTimeout(() => {
      setFocus(false);
    }, 300);
  };

  const filteredList = useMemo(() => {
    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(appliedValue.toLowerCase()),
    );
  }, [appliedValue]);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={value}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleOnChange}
            onFocus={() => setFocus(true)}
            onBlur={() => closeDropdown()}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {focus && (
            <div className="dropdown-content">
              {filteredList.length ? (
                filteredList.map((person: Person) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOnClick(person)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        onSelected(person);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="has-text-link"> {person.name} </p>
                  </div>
                ))
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
});
