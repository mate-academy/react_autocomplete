import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import { peopleFromServer } from './data/people';

import './App.scss';
// import { Person } from './types/Person';

export const App: React.FC = () => {
  const [change, setChange] = useState('');

  const { name, born, died } = peopleFromServer[0];
  const [appliedValue, setAppliedValue] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const handleDebouncedChange = useCallback(debounce((inputValue: string) => {
    setAppliedValue(inputValue);
  }, 1000), []);

  const handleInputFocus = () => {
    setIsDropdownActive(true);
  };

  const handleInputBlur = () => {
    setIsDropdownActive(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setChange(inputValue);
    handleDebouncedChange(inputValue);
  };

  const filterPerson = useMemo(() => {
    return peopleFromServer.filter(perso => perso.name
      .toLowerCase().includes(appliedValue.toLowerCase()));
  }, [appliedValue]);

  const handleClick = useCallback((persName: string) => {
    setChange(persName);
    setIsDropdownActive(false);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleChange}
            value={change}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filterPerson.length ? (
              filterPerson.map(pers => (
                <div
                  style={{ cursor: 'pointer' }}
                  className="dropdown-item"
                  key={pers.name}
                  role="button"
                  onClick={() => handleClick(pers.name)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleClick(pers.name);
                    }
                  }}
                >
                  <p
                    className="has-text-link"
                  >
                    {pers.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" key="No matching suggestions">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
