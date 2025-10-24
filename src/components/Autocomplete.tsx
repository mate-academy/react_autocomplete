import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import { useDebounce } from '../hooks/useDebounce';

type Props = {
  items: Person[];
  onInputChange?: () => void;
  onSelected: (person: Person) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  items,
  onInputChange,
  onSelected,
  delay = 300,
}) => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const debouncedQuery = useDebounce(value, delay);
  const lastFilteredQueryRef = useRef<string>('');
  const lastFilteredResultRef = useRef<Person[] | null>(null);

  const filter = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return (list: Person[]) => list;
    }

    return (list: Person[]) =>
      list.filter(person =>
        person.name.toLowerCase().includes(normalizedQuery),
      );
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const normalizedValue = debouncedQuery.trim();

    if (
      lastFilteredQueryRef.current === normalizedValue &&
      lastFilteredResultRef.current
    ) {
      setSuggestions(lastFilteredResultRef.current);

      return;
    }

    const newFiltered = normalizedValue === '' ? items : filter(items);

    setSuggestions(newFiltered);
    lastFilteredQueryRef.current = normalizedValue;
    lastFilteredResultRef.current = newFiltered;
  }, [debouncedQuery, filter, items, isOpen]);

  const handleFocus = () => {
    setIsOpen(true);
    if (value.trim() === '') {
      setSuggestions(items);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (onInputChange) {
      onInputChange();
    }

    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setValue(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), delay);
  };

  const showNoMatches =
    isOpen && suggestions.length === 0 && debouncedQuery !== '';

  return (
    <>
      <div
        className={cn('dropdown', { 'is-active': isOpen && !showNoMatches })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => {
              const isMale = person.sex === 'm';

              return (
                <a
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => handleSelect(person)}
                >
                  <p
                    className={cn({
                      'has-text-link': isMale,
                      'has-text-danger': !isMale,
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {showNoMatches && (
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
