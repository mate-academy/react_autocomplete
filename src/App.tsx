import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

interface AppProps {
  debounceDelay: number;
}

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  const [selectedName, setSelectedName] =
    useState<string>('No selected person');
  const [personList, setPersonList] = useState(peopleFromServer);
  const [inputName, setInputName] = useState('');
  const [appliedInput, setAppliedInput] = useState('');
  const [isInputFocus, setIsInputFocus] = useState(true);

  const applyInput = useCallback(
    debounce((value: string) => {
      setAppliedInput(value);
    }, debounceDelay),
    [debounceDelay],
  );

  useEffect(() => {
    if (inputName.trim() === '') {
      setPersonList(peopleFromServer);
    } else {
      setPersonList(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(appliedInput.toLowerCase()),
        ),
      );
    }
  }, [appliedInput, inputName]);

  function handleInputBlur() {
    setTimeout(() => {
      setIsInputFocus(false);
    }, 200)
  }

  function handlePersonClick(person: Person) {
    setInputName(person.name);
    setSelectedName(`${person.name} (${person.born} - ${person.died})`);
    setIsInputFocus(false);
  }

  function handleChangeInput(event: ChangeEvent<HTMLInputElement>) {
    setInputName(event.target.value);
    applyInput(event.target.value);
    setSelectedName('No selected person');
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedName}
        </h1>

        <div className={`dropdown ${isInputFocus ? 'is-active' : ''} `}>
          <div className="dropdown-trigger">
            <input
              value={inputName}
              onFocus={() => setIsInputFocus(true)}
              onBlur={handleInputBlur}
              onChange={handleChangeInput}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {personList.map(person => (
                <div
                  key={person.name}
                  onClick={() => handlePersonClick(person)}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {personList.length === 0 && (
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
      </main>
    </div>
  );
};
