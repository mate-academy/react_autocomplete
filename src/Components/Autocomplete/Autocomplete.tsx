import React, { useEffect, useRef, useState } from 'react';
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
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const prevQuery = useRef('');
  const selectedRef = useRef<Person | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleSelectedPerson = (person: Person) => {
    selectedRef.current = person;
    onSelected(person);
    setQuery(person.name);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);

    if (newQuery !== selectedRef.current?.name) {
      onSelected(null);
    }
  };

  const handleFocus = () => {
    if (!query.trim()) {
      setFilteredPeople(people);
    }

    setIsDropdownOpen(true);
  };

  useEffect(() => {
    if (query === prevQuery.current) {
      return;
    }

    if (!query.trim()) {
      setFilteredPeople(people);
      prevQuery.current = query;

      return;
    }

    const handler = setTimeout(() => {
      setFilteredPeople(
        people.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
      prevQuery.current = query;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay, people]);

  return (
    <>
      <div
        className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}
        ref={wrapperRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 500)} // this delay needs for tests
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.name}
                data-cy="suggestion-item"
              >
                <p
                  className="has-text-link"
                  onClick={() => handleSelectedPerson(person)}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isDropdownOpen && query && filteredPeople.length === 0 && (
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
    </>
  );
};
