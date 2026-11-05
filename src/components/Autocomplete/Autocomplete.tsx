import React, { useState, useEffect } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const trimmedQuery = appliedQuery.trim();

  let filteredPeople = people;

  if (trimmedQuery) {
    filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setQuery(newText);
    setIsOpen(true);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <div
      className={`dropdown ${isOpen ? 'is-active' : ''}`}
      style={{ width: '100%' }}
    >
      <div className="dropdown-trigger" style={{ width: '100%' }}>
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
        />
      </div>

      {isOpen && (
        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          style={{ width: '100%' }}
        >
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelectPerson(person)}
                  style={{ cursor: 'pointer' }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="notification is-danger is-light m-0"
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
