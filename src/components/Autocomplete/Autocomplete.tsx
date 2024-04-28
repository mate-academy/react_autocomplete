import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, delay = 300, onSelected = () => {} }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Person[]>(people);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
      const timerId = setTimeout(() => {
        if (query !== appliedQuery) {
          setAppliedQuery(query);
        }

        setIsFiltering(false);
      }, delay);

      return () => {
        clearTimeout(timerId);
      };
    }, [query, delay, appliedQuery]);

    useEffect(() => {
      const newSuggestions = people.filter(person => {
        return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
      });

      setSuggestions(newSuggestions);
      setIsFiltering(false);
    }, [people, appliedQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelected(null);
      setIsFiltering(true);
      setQuery(e.target.value);
    };

    const handleInputFocus = () => {
      setIsInputFocused(true);
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        setIsInputFocused(false);
      }, 200);
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

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {!isFiltering && isInputFocused && !!suggestions.length && (
              <div className="dropdown-content">
                {suggestions.map(person => {
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
            style={{ width: 'fit-content' }}
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    );
  },
);
