import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import { useFilter } from '../hooks/Filter';
import { PeopleList } from './peopleList';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [rawInput, setRawInput] = useState('');
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);

  const filteredPeople = useFilter(people, query);

  // 🔹 debounce
  useEffect(() => {
    const trimmed = rawInput.trim();

    const timer = setTimeout(() => {
      setQuery(trimmed); // даже пустая строка → покажет всех
    }, delay);

    return () => clearTimeout(timer);
  }, [rawInput, delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setRawInput(value);
    setShow(true);

    // 🔴 ВАЖНО: сбрасываем выбранного человека
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setRawInput(person.name);
    setQuery(person.name);
    setShow(false);
    onSelected(person);
  };

  const showError = show && query !== '' && filteredPeople.length === 0;

  return (
    <div className={`dropdown ${show ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          data-cy="search-input"
          placeholder="Enter a part of the name"
          value={rawInput}
          onChange={handleChange}
          onFocus={() => setShow(true)}
        />
      </div>

      {show && (
        <div className="dropdown-menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            <PeopleList people={filteredPeople} onSelect={handleSelect} />
          </div>
        </div>
      )}

      {showError && (
        <div
          className="notification is-danger is-light mt-2"
          data-cy="no-suggestions-message"
        >
          No matching suggestions
        </div>
      )}
    </div>
  );
};
