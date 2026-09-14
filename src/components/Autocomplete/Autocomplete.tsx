import { useEffect, useMemo, useState } from 'react';

import type { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete = ({ people, onSelected, delay = 300 }: Props) => {
  const [text, setText] = useState<string>('');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQuery(text.trim());
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [text, delay]);

  const visiblePeople = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, query]);

  const handlePersonSelect = (person: Person) => {
    setText(person.name);
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={text}
          onFocus={() => setIsOpen(true)}
          onChange={event => {
            setText(event.target.value);
            setIsOpen(true);
            onSelected(null);
          }}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <button
                type="button"
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => handlePersonSelect(person)}
              >
                <span
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </span>
              </button>
            ))}

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
          </div>
        </div>
      )}
    </div>
  );
};
