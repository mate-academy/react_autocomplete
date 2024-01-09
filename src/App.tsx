import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { peopleFromServer } from './data/people';

import './App.scss';

export const App: React.FC = () => {
  const [change, setChange] = useState('');
  const [appliedValue, setAppliedValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState({
    name: '',
    born: '',
    died: '',
  });
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const { name, born, died } = selectedPerson || {};

  const handleDebouncedChange = useCallback(
    debounce((inputValue: string) => {
      setAppliedValue(inputValue);
    }, 1000),
    [],
  );

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
      .toLowerCase().includes(appliedValue.toLowerCase().trim()));
  }, [appliedValue]);

  const handleClick = useCallback((persName) => {
    setChange(persName.name);
    setSelectedPerson(persName);
    setIsDropdownActive(false);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {name ? (
          `${name} (${born} = ${died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': isDropdownActive,
      })}>
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
                  className="dropdown-item"
                  key={pers.name}
                >
                  <button
                    style={{
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    type="button"
                    onMouseDown={() => handleClick(pers)}
                  >
                    <p
                      className="has-text-link"
                    >
                      {pers.name}
                    </p>
                  </button>
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
    </main >
  );
};
