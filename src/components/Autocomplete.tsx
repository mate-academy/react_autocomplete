import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  delay: number;
  selectedPerson: Person | null;
  onClearSelected: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
  selectedPerson,
  onClearSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const applyQuery = useCallback(
    (value: string) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setAppliedQuery(value);
      }, delay);
    },
    [delay],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const filteredPeople = appliedQuery
    ? people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      )
    : people;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const trimmed = value.trim();

    if (selectedPerson) {
      onClearSelected();
    }

    setQuery(value);

    if (trimmed === '') {
      setAppliedQuery('');

      return;
    }

    if (trimmed === appliedQuery) {
      return;
    }

    applyQuery(trimmed);
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={classNames('dropdown', { 'is-active': isOpen })}
      onBlur={handleBlur}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.id}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={() => handleSelect(person)}
            >
              <p
                className={classNames({
                  'has-text-danger': selectedPerson?.id === person.id,
                  'has-text-link': selectedPerson?.id !== person.id,
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isOpen && filteredPeople.length === 0 && (
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
};
