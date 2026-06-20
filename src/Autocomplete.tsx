import React, { useEffect, useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import cn from 'classnames';

interface Props {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedInputValue, setDebouncedInputValue] = useState('');

  const trimmedQuery = debouncedInputValue.trim();

  let filteredPeople = peopleFromServer;

  if (trimmedQuery !== '') {
    filteredPeople = peopleFromServer.filter(person => {
      const nameLower = person.name.toLowerCase();
      const queryLower = trimmedQuery.toLowerCase();

      return nameLower.includes(queryLower);
    });
  }

  useEffect(() => {
    if (inputValue === debouncedInputValue) {
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay, debouncedInputValue]);

  return (
    <>
      <div
        className={cn('dropdown', {
          'is-active':
            isOpen && (filteredPeople.length > 0 || inputValue.trim() === ''),
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={event => {
              setInputValue(event.target.value);
              if (onSelected) {
                onSelected(null);
              }
            }}
            onFocus={() => {
              setIsOpen(true);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setInputValue(person.name);
                    setDebouncedInputValue(person.name);
                    setIsOpen(false);
                    if (onSelected) {
                      onSelected(person);
                    }
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && debouncedInputValue.trim() !== '' && (
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
