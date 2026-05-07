import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [query, delay]);

  const visiblePeople = useMemo(() => {
    if (appliedQuery.trim() === '') {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    setIsOpen(true);

    if (selectedPerson && newQuery !== selectedPerson.name) {
      onSelected(null);
    }
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.length > 0 ? (
              visiblePeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
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
