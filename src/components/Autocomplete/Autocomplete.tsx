import { Person } from '../../types/Person';
import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete = ({ people, onSelected, delay = 300 }: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, delay]);

  const visiblePeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isOpen,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              onSelected(null);
            }}
            onFocus={handleFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                data-cy="suggestion-item"
                onClick={() => {
                  handleSelect(person);
                }}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {visiblePeople.length === 0 && (
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
