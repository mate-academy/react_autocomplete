import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type Callback = (...args: any[]) => void;

function debounce(callback: Callback, delay: number) {
  let timerId = 0;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return (...args: any[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [appliedInputValue, setAppliedInputValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [visiblePeople, setVisiblePeople] = useState(peopleFromServer);

  const handleInputFocus = () => {
    setTouched(true);
  };

  const handleInputBlur = () => {
    setTouched(false);
  };

  const handleReset = () => {
    setInputValue('');
    setTouched(false);
    setSelectedUser(null);
    setVisiblePeople(peopleFromServer);
  };

  const applyValue = useCallback(debounce(setAppliedInputValue, 1000), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyValue(event.target.value);
  };

  useEffect(() => {
    const filteredPeople = peopleFromServer.filter((person) => {
      const personName = person.name.toLowerCase();
      const value = appliedInputValue.toLowerCase();

      return personName.includes(value);
    });

    setVisiblePeople(filteredPeople);
  }, [appliedInputValue, selectedUser, inputValue]);

  return (
    <main className="section">
      {selectedUser && (selectedUser.name === inputValue) ? (
        <h1 className="title">
          {`${selectedUser.name} (${selectedUser.born} = ${selectedUser.died})`}
        </h1>
      ) : (<h1 className="title">No selected person</h1>)}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
        <button
          type="button"
          className="button is-info is-outlined"
          onClick={handleReset}
        >
          Reset
        </button>
        {touched && (
          <div className="dropdown-menu" role="menu">
            <div
              className="dropdown-content"
              style={{ maxHeight: '300px', overflow: 'auto' }}
            >
              {visiblePeople.length ? (
                <>
                  {visiblePeople.map((person) => (
                    <div
                      className={classNames(
                        'dropdown-item button is-small is-link is-inverted',
                        {
                          'button is-light': selectedUser
                          && person.name === inputValue,
                        },
                      )}
                      key={person.name}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        className="has-text-link"
                        key={person.name}
                        onMouseDown={() => {
                          setSelectedUser(person);
                          setInputValue(person.name);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            setSelectedUser(person);
                            setInputValue(person.name);
                          }
                        }}
                      >
                        {person.name}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
