import { useEffect, useState } from 'react';
import cn from 'classnames';

import { Person } from './types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onChange?: () => void;
}

export const Autocomplete = ({
  people,
  delay = 300,
  onSelected,
  onChange,
}: Props) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>(people);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();

      if (normalizedQuery === '') {
        setSuggestions(people);
      } else {
        setSuggestions(
          people.filter(person =>
            person.name.toLowerCase().includes(normalizedQuery),
          ),
        );
      }
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, people, delay]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
    onChange?.();
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': isOpen,
      })}
    >
      <div className="dropdown-trigger">
        <div className="control">
          <input
            data-cy="search-input"
            className="input"
            type="text"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <button
                  key={`${person.name}-${person.born}`}
                  type="button"
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  {person.name}
                </button>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
