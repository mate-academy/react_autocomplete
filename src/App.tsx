import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

function debounce(callback: (...args: unknown[]) => void, delay: number) {
  let timerId = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [appliedInputValue, setAppliedInputValue] = useState('');
  const applyValue = useCallback(debounce(setAppliedInputValue, 1000), []);
  let foundPeopleFromServer;

  if (selectedUser === '') {
    foundPeopleFromServer = 0;
  } else {
    foundPeopleFromServer = peopleFromServer.findIndex((
      person,
    ) => person.name.toLowerCase() === selectedUser.toLowerCase());
  }

  const { name, born, died } = peopleFromServer[foundPeopleFromServer];
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyValue(event.target.value);
  };

  const foundName = useMemo(() => {
    return peopleFromServer.filter((person) => {
      const personName = person.name.toLowerCase();
      const value = appliedInputValue.toLowerCase();

      return personName.includes(value);
    });
  }, [appliedInputValue, foundPeopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        {inputValue && foundName.length > 0 && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {foundName.map((person) => (
                <div className="dropdown-item" key={person.name}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`${
                      selectedUser === person.name
                        ? 'has-background-info has-text-white'
                        : 'has-text-link'
                    }`}
                    key={person.name}
                    onClick={() => {
                      setSelectedUser(person.name);
                      setInputValue(person.name);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setSelectedUser(person.name);
                        setInputValue(person.name);
                      }
                    }}
                  >
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
