import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

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
  const [selectedUser, setSelectedUser] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [appliedInputValue, setAppliedInputValue] = useState('');
  const [touched, setTouched] = useState(false);

  const handleInputFocus = () => {
    setTouched(true);
  };

  const handleInputBlur = () => {
    setTouched(false);
  };

  const applyValue = useCallback(debounce(setAppliedInputValue, 1000), []);

  // const titleField = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if(titleField.current) {
  //     titleField.current.focus()
  //   }
  // }, [])

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
      {inputValue !== '' && selectedUser ? (
        <h1 className="title">
          {`${name} (${born} = ${died})`}
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
            // ref={titleField}
          />
        </div>
        {foundName.length === 0 && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item">
                <div
                  role="button"
                  tabIndex={0}
                  className="has-text-link"
                >
                  No matching suggestions
                </div>
              </div>
            </div>
          </div>
        )}
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

        {inputValue === '' && touched && (
          <div
            className="dropdown-menu"
            role="menu"
            onBlur={handleInputBlur}
          >
            <div className="dropdown-content">
              {peopleFromServer.map((person) => (
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
