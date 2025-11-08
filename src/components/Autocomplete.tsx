import React, { useRef, useState } from 'react';
import { Person } from '../types/Person';
interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  debounceDelay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>(people);
  const [selected, setSelected] = useState<Person | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastInputValue = useRef('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);

    if (selected && value !== selected.name) {
      setSelected(null);
      onSelected(null);
    }

    setIsDropdownOpen(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value === '') {
        setSuggestions(people);
      } else {
        const filtered = people.filter(p =>
          p.name.toLowerCase().includes(value.toLowerCase()),
        );

        setSuggestions(filtered);
      }

      lastInputValue.current = value;
    }, debounceDelay);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelected(person);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setIsDropdownOpen(true)}
            data-cy="search-input"
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 350)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(p => (
                <div
                  key={p.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(p)}
                >
                  <p
                    className={
                      p.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {p.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger" data-cy="no-suggestions-message">
                  No matching suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
