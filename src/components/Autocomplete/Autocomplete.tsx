import React, { useState, useEffect } from 'react';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';
import classNames from 'classnames';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface Props {
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    if (debouncedValue) {
      const filtered = peopleFromServer.filter(person =>
        person.name.includes(debouncedValue),
      );

      setSuggestions(filtered);
    } else {
      setSuggestions(peopleFromServer);
    }
  }, [debouncedValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onSelected(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    onSelected(person);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onFocus={() => {
              setFocusedInput(true);
            }}
            onBlur={() => {
              setFocusedInput(false);
            }}
            onChange={handleInputChange}
          />
        </div>

        {suggestions.length > 0 && focusedInput && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                  onMouseDown={() => {
                    handleSuggestionClick(person);
                  }}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {suggestions.length === 0 && (
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
    </>
  );
};
