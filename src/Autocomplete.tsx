import { useEffect, useMemo, useState } from 'react';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete = ({ people, onSelected, delay = 300 }: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const normalizedQuery = appliedQuery.trim().toLowerCase();

  let visiblePeople: Person[];

  if (normalizedQuery === '') {
    visiblePeople = people;
  } else {
    visiblePeople = people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  const applyQuery = useMemo(() => {
    return debounce((value: string) => {
      setAppliedQuery(value);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  return (
    <>
      <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => {
              const value = event.target.value;

              if (value !== query) {
                onSelected(null);
              }

              setQuery(value);
              onSelected(null);

              if (value.trim() === '') {
                setAppliedQuery('');
                applyQuery.cancel();

                return;
              }

              applyQuery(value);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => {
                  setQuery(person.name);
                  setAppliedQuery(person.name);
                  setIsOpen(false);
                  onSelected(person);
                }}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && visiblePeople.length === 0 && (
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
