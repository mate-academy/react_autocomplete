import { useEffect, useMemo, useState } from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onQueryChange: () => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  onQueryChange,
}) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const normalizedQuery = appliedQuery.trim().toLowerCase();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  const visiblePeople = useMemo(() => {
    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, normalizedQuery]);

  return (
    <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          type="text"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            onQueryChange();
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {visiblePeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => {
                setQuery(person.name);
                setAppliedQuery(person.name);
                setIsOpen(false);
                onSelected(person);
              }}
            >
              <p>{person.name}</p>
            </div>
          ))}

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
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
