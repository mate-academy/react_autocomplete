import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import debounce from 'lodash.debounce';

type Props = {
  delay: number;
  onSelected: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const App: React.FC<Props> = ({ delay = 300 }) => {
  // const { name, born, died } = peopleFromServer[0];
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debouncedSetInputValue = useMemo(
    () =>
      debounce((value: string) => {
        setInputValue(value);
      }, delay),
    [delay],
  );

  const filteredNames = useMemo(() => {
    return peopleFromServer.filter(person => person.name.includes(inputValue));
  }, [inputValue]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {/* {`${name} (${born} - ${died})`} */}
        </h1>

        <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              onFocus={() => setIsDropdownVisible(true)}
              onBlur={() => setIsDropdownVisible(false)}
            />
          </div>

          {isDropdownVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredNames.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.born}
                    data-cy="suggestion-item"
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredNames.length === 0 && (
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
