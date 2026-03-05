import { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelect: (person: Person | null) => void;
}

export const PeopleAutocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const normalisedQuery = query.trim();

      if (normalisedQuery !== lastQuery) {
        setLastQuery(normalisedQuery);
      }
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, delay]);

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(lastQuery.toLowerCase()),
  );

  return (
    <>
      <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            ref={field}
            onChange={event => {
              setQuery(event.target.value);
              onSelect(null);
            }}
            onFocus={() => {
              setIsActive(true);
              setLastQuery('');
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsActive(false);
              }, 200);
            }}
          />
        </div>

        {filteredPeople.length !== 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    onSelect(person);
                    setQuery(person.name);
                    setIsActive(false);
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
        )}
      </div>

      {filteredPeople.length === 0 && lastQuery.length !== 0 && isActive && (
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
