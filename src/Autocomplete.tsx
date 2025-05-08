import React, { useState, useEffect, useCallback } from 'react';

interface Person {
  name: string;
  born: number;
  died: number;
  sex: string;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

interface AutocompleteProps {
  people: Person[];
  delay?: number; // Customizable debounce delay (default: 300ms)
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Debounce for filtering suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setFilteredPeople(people);
      } else {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay, people]);

  // Handle selection
  const handleSelect = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setDropdownOpen(false);
      onSelected(person);
    },
    [onSelected],
  );

  // Clear selected person when input changes
  useEffect(() => {
    if (selectedPerson && query.trim() && query !== selectedPerson.name) {
      setSelectedPerson(null);
      onSelected(null);
    }
  }, [query, selectedPerson, onSelected]);

  return (
    <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.name}
                  role="menuitem"
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="dropdown-item has-text-danger"
                data-cy="no-suggestions-message"
              >
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
