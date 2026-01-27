import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
  children: (props: {
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
  }) => React.ReactNode;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  debounceDelay = 300,
  onSelected,
  children,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, debounceDelay);

    return () => clearTimeout(id);
  }, [query, debounceDelay]);

  const suggestions = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [people, debouncedQuery]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected?.(person);
  };

  return (
    <>
      {children({
        value: query,
        onChange: setQuery,
        onFocus: () => setIsOpen(true),
      })}

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && suggestions.length === 0 && isOpen && (
        <div
          className="notification is-danger is-light mt-3"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
