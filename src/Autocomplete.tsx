import React, { useEffect, useState, useCallback } from 'react';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { AutocompleteProps } from './types/Autocomplete';

export const Autocomplete: React.FC<AutocompleteProps> = ({
  delay = 300,
  onSelect,
  people,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  const previousQueryRef = React.useRef('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((query: string) => {
      if (query === previousQueryRef.current) {
        return;
      }

      previousQueryRef.current = query;

      if (query === '') {
        setFilteredPeople(people);
      } else {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        );

        setFilteredPeople(filtered);
      }
    }, delay),
    [delay, people],
  );

  useEffect(() => {
    debouncedFilter(inputValue);

    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter, inputValue]);

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              onInputChange?.(e.target.value);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => {
                  setInputValue(person.name);
                  onSelect(person);
                  setIsOpen(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {filteredPeople.length === 0 && inputValue !== '' && (
        <div
          // eslint-disable-next-line max-len
          className="notification is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
