import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = React.memo((({
  people,
  onSelected = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>(people);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (query !== appliedQuery) {
        setAppliedQuery(query);
      }
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, delay, appliedQuery]);

  useEffect(() => {
    const result = people.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });

    setSuggestions(result);
  }, [people, appliedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(null);
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 100);
  };

  return (
    <div>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={query}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          {(isInputFocused && suggestions.length > 0) && (
            <div className="dropdown-content">
              {suggestions.map((person) => {
                const { name, slug, sex } = person;

                return (
                  <button
                    type="button"
                    className="dropdown-item button is-white"
                    data-cy="suggestion-item"
                    key={slug}
                    onClick={() => {
                      onSelected(person);
                      setQuery(name);
                    }}
                  >
                    <p
                      className={classNames({
                        'has-text-link': sex === 'm',
                        'has-text-danger': sex === 'f',
                      })}
                    >
                      {name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {!suggestions.length && (
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
  );
}));
