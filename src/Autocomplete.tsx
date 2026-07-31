import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

interface Person {
  name: string;
  born: number;
  died: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setDebouncedQuery('');

      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmedQuery);
    }, delay || 300);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    onSelected(null);
    setIsOpen(true);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <input
        value={query}
        placeholder="Enter a part of the name"
        data-cy="search-input"
        className="input dropdown-trigger"
        type="text"
        onChange={handleInputChange}
        onFocus={() => {
          setIsOpen(true);
        }}
      />

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              <div data-cy="suggestions-list">
                {filteredPeople.map(person => (
                  <div
                    key={`${person.name}-${person.born}`}
                    data-cy="suggestion-item"
                    className="dropdown-item"
                    onClick={() => handleSelectPerson(person)}
                  >
                    {person.name}
                  </div>
                ))}
              </div>
            ) : (
              <div data-cy="no-suggestions-message" className="dropdown-item">
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
