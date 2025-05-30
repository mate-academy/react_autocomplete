import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

interface Props {
  people: Person[];
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  debounceDelay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [shownPeople, setShownPeople] = useState<Person[]>([]);
  const [hasPerson, setHasPerson] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const prevQueryRef = useRef('');

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetQuery = useRef(
    debounce((value: string) => {
      if (prevQueryRef.current !== value) {
        prevQueryRef.current = value;
        setAppliedQuery(value);
      }
    }, debounceDelay),
  ).current;

  useEffect(() => {
    const queryLower = appliedQuery.toLowerCase().trim();

    if (!queryLower) {
      setShownPeople(people);
      setHasPerson(true);

      return;
    }

    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(queryLower),
    );

    setShownPeople(filtered);
    setHasPerson(filtered.length > 0);
  }, [appliedQuery, people]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
    onSelected(null);
    debouncedSetQuery(value);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const handleFocus = () => {
    if (!query.trim()) {
      setShownPeople(people);
    }

    setIsOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {hasPerson ? (
              shownPeople.map(person => (
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
