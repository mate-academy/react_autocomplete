import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  onSelected: (person: Person) => void;
  onClear?: () => void;
  delay?: number;
};

export const Autocomplete = ({
  people,
  onSelected,
  onClear,
  delay = 300,
}: AutocompleteProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        const trimmedValue = value.trim();

        if (trimmedValue !== query) {
          setQuery(trimmedValue);
        }
      }, delay),
    [delay, query],
  );

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setCurrentInput(person.name);
    setIsFocused(false);
    onSelected(person);
    inputRef.current?.blur();
  };

  return (
    <div
      className={classNames('dropdown', { 'is-active': isFocused })}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={currentInput}
          onChange={e => {
            setCurrentInput(e.target.value);
            debouncedSetQuery(e.target.value);
            onClear?.();
          }}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={e => {
                e.preventDefault(); // ⬅️ блокує onBlur інпута
                handleSelectPerson(person); // ⬅️ тут setIsFocused(false) закриє dropdown
              }}
            >
              <p className="has-text-link">{person.name}</p>
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
