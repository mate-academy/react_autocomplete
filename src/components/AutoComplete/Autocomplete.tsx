import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const AutoComplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [isOpen, setIsOpen] = useState(false);

  const timerId = useRef<number>();
  const lastFilteredTextRef = useRef('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    onSelected(null);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (searchText === '') {
      setFilteredPeople(people);
    }
  };

  const handleSelect = (person: Person) => {
    setSearchText(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  useEffect(() => {
    const normalized = searchText.trim().toLowerCase();

    if (normalized === lastFilteredTextRef.current) {
      return;
    }

    if (normalized === '') {
      setFilteredPeople(people);
      lastFilteredTextRef.current = '';

      return;
    }

    clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      setFilteredPeople(
        people.filter(person => person.name.toLowerCase().includes(normalized)),
      );
      lastFilteredTextRef.current = normalized;
    }, delay);

    return () => clearTimeout(timerId.current);
  }, [searchText, people, delay]);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.id}
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
