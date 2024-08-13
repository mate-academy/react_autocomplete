import React, { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  debounceDelay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isActive, setIsActive] = useState(false);

  const filterSuggestions = useCallback(
    (text: string) => {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(text.toLowerCase()),
      );

      setSuggestions(filtered);
    },
    [people],
  );

  const debouncedFilterSuggestions = useMemo(
    () => debounce(filterSuggestions, debounceDelay),
    [filterSuggestions, debounceDelay],
  );

  useEffect(() => {
    if (inputValue) {
      debouncedFilterSuggestions(inputValue);
    } else {
      setSuggestions(people);
    }

    return () => {
      debouncedFilterSuggestions.cancel();
    };
  }, [inputValue, people, debouncedFilterSuggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsActive(true);
    onSelected(null);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    if (inputValue === '') {
      setSuggestions(people);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setIsActive(false);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {isActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p
                    className={classNames('has-text-link', {
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
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
          </div>
        </div>
      )}
    </div>
  );
};
