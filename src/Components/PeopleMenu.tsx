import React, { useMemo, useCallback, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  delay?: number;
  people: Person[];
  onSelected: (person: Person | null) => void;
};

function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  let timerId = 0;

  return (...args: T) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const PeopleMenuComponent: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const filterPeople = useMemo(() => {
    if (!appliedQuery.trim()) {
      return people;
    }

    return people.filter(person =>
      person.name
        .toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()),
    );
  }, [appliedQuery, people]);

  const visiblePeople = useMemo(() => {
    return isFocused ? filterPeople : [];
  }, [isFocused, filterPeople]);

  const error = isFocused && query && filterPeople.length === 0;

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelected(null);
      setIsOpen(true);
    },
    [setQuery, applyQuery, onSelected, setIsOpen],
  );

  const handleClickInput = useCallback(
    (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsOpen(false);
    },
    [onSelected, setQuery, setIsOpen, setAppliedQuery],
  );

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleInput}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsOpen(false);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {visiblePeople.map(person => (
            <a
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleClickInput(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </a>
          ))}
        </div>
      </div>
      {error && (
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

PeopleMenuComponent.displayName = 'PeopleMenu';

export const PeopleMenu = React.memo(PeopleMenuComponent);
