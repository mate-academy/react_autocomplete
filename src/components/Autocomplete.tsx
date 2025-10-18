import React, { useState, useMemo, useRef } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person) => void;
  selectedPerson?: Person | null;
}

function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  let timerId = 0;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected = () => {},
  selectedPerson = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const lastAppliedRef = useRef('');

  const applyQuery = useMemo(
    () =>
      debounce((value: string) => {
        if (lastAppliedRef.current !== value) {
          lastAppliedRef.current = value;
          setAppliedQuery(value);
        }
      }, delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setQuery(event.target.value);
    applyQuery(event.target.value);
    if (selectedPerson) {
      onSelected(null);
    }
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setIsFocused(false);
  };

  const normalizedQuery = appliedQuery.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, people]);

  return (
    <div
      className={cn('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-cy="search-input"
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content" onMouseDown={e => e.preventDefault()}>
          {filteredPeople.map(person => (
            <div
              key={person.slug}
              className={cn('dropdown-item', {
                'is-active': selectedPerson?.slug === person.slug,
              })}
              data-cy="suggestion-item"
              onClick={() => handleSelectPerson(person)}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}

          {filteredPeople.length === 0 && (
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
    </div>
  );
};
