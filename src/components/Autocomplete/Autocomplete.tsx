import React, { useRef, useState } from 'react';
import { Person } from '../../types/Person';
import { DropContent } from '../DropContent';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceTime?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [lastValue, setLastValue] = useState('');
  const debounceTimeout = useRef<number>();
  const selectedPersonRef = useRef<Person | null>(null);

  const handleInputChange = (element: React.ChangeEvent<HTMLInputElement>) => {
    const value = element.target.value;

    setQuery(value);

    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = window.setTimeout(() => {
      if (value === lastValue) {
        return;
      }

      setLastValue(value);

      if (
        selectedPersonRef.current &&
        value !== selectedPersonRef.current.name
      ) {
        selectedPersonRef.current = null;
        onSelected(null);
      }

      if (value.trim() === '') {
        setFilteredPeople(people);
        setIsOpen(true);

        return;
      }

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(value.toLowerCase()),
      );

      setFilteredPeople(filtered);
      setIsOpen(true);
    }, debounceTime);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    setLastValue(person.name);
    selectedPersonRef.current = person;
    onSelected(person);
  };

  const handleFocus = () => {
    if (query.trim() === '') {
      setFilteredPeople(people);
      setIsOpen(true);
    }
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
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {filteredPeople.length > 0 ? (
            <DropContent peoples={filteredPeople} onSelected={handleSelect} />
          ) : (
            query.trim() !== '' && (
              <div
                className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start
                "
                data-cy="no-selected-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
