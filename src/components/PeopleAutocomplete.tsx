import { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const PeopleAutocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const normalizedQuery = query.trim();

      if (normalizedQuery !== appliedQuery) {
        setAppliedQuery(normalizedQuery);
      }
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, delay, appliedQuery]);

  const visiblePeople = people.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  return (
    <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          ref={field}
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            onSelected(null);
          }}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {visiblePeople.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
              onMouseDown={() => {
                onSelected(person);
                setQuery(person.name);
                setIsActive(false);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
      {visiblePeople.length === 0 && appliedQuery.length !== 0 && (
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
