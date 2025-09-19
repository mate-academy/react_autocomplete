import React, { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
  setSelectedPerson: (value: null) => void;
  selectedPerson: Person | null;
  delay: number;
  inputValue: string;
  setInputValue: (value: string) => void;
}

function debounce(callback: Function, delayTime: number) {
  let timerId = 0;

  return (...args: any) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delayTime);
  };
}

export const DropdownList: React.FC<Props> = React.memo(
  ({
    people,
    onSelected,
    setSelectedPerson,
    selectedPerson,
    delay,
    inputValue,
    setInputValue
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const debounceAutocomplete = useCallback(
      debounce(setInputValue, delay),
      [],
    );

    const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);

      if (event.target.value !== selectedPerson?.name) {
        setSelectedPerson(null);
      }

      debounceAutocomplete(event.target.value);
    };

    return (
      <>
        <div className={classNames('dropdown', { 'is-active': isFocused})}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-qa="search-input"
              value={inputValue}
              onChange={handleInputValue}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-qa="suggestions-list">
            <div className="dropdown-content">
              {people.map((person: Person) => {
                return (
                  <a
                    key={person.name}
                    className="dropdown-item"
                    data-qa="suggestion-item"
                    onMouseDown={() => {
                      onSelected(person);
                      setInputValue(person.name);
                      setIsFocused(false);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
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
            data-qa="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </>
    );
  },
);
