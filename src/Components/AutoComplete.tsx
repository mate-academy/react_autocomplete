import React, { useCallback, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  delay: number;
  peopleFromServer: Person[];
  setSelectedPerson: (person: Person | null) => void; // Corrected prop name and type
}

export const AutoComplete: React.FC<Props> = ({
  delay,
  peopleFromServer,
  setSelectedPerson,
}) => {
  const [input, setInput] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [suggestPeople, setSuggestPeople] = useState(peopleFromServer);

  const debounce = useCallback(
    (callback: (inputValue: string) => void, del: number) => {
      let timerId: ReturnType<typeof setTimeout>;

      return (...args: unknown[]) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          callback(...(args as [string]));
        }, del);
      };
    },
    [],
  );

  const inputWithDelay = useCallback(
    debounce((inputValue: string) => {
      const matchedPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(inputValue.toLowerCase()),
      );

      setSuggestPeople(matchedPeople);
      setSuggestionsVisible(matchedPeople.length > 0);
      setErrorVisible(matchedPeople.length === 0);
    }, delay),
    [delay, peopleFromServer],
  );

  const handleSelectPerson = (personName: string) => {
    setTimeout(() => {
      setSuggestionsVisible(false);
    }, 10);

    setInput(personName);

    setSuggestionsVisible(false);
    const tmp = suggestPeople.find(
      person => person.name.toLowerCase() === personName.toLowerCase(),
    );

    setSelectedPerson(tmp || null);
  };

  const handleBlur = () => {
    setSuggestionsVisible(!!input);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={input}
              onChange={e => {
                setInput(e.target.value);
                inputWithDelay(e.target.value);
              }}
              onBlur={handleBlur}
              onFocus={() => setSuggestionsVisible(true)}
            />
          </div>

          {suggestionsVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestPeople.map(person => (
                  <div
                    data-cy="suggestion-item"
                    className="item"
                    key={person.name}
                    onMouseDown={() => handleSelectPerson(person.name)}
                  >
                    {person.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {errorVisible && (
          <div
            className="notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
