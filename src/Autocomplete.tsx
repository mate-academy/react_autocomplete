// Autocomplete.tsx
import React, { useState, useRef } from 'react';
import classNames from 'classnames';

type Person = {
  name: string;
  born: number;
  died: number;
};

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [prevQuery, setPrevQuery] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const filterSuggestions = (query: string) => {
    if (!query.trim()) {
      setSuggestions(people);
    } else {
      const lower = query.toLowerCase();
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(lower),
      );

      setSuggestions(filtered);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);

    setShowDropdown(true);
    onSelected(null);

    if (value === prevQuery) {
      return;
    }

    setPrevQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      return;
    }, delay);
    setPrevQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      filterSuggestions(value);
    }, delay);
  };

  const handleFocus = () => {
    setShowDropdown(true);
    if (!inputValue.trim()) {
      setSuggestions(people);
    }
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setShowDropdown(false);
    onSelected(person);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': showDropdown })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>

      {showDropdown && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length === 0 && (
              <div
                className="dropdown-item has-text-danger"
                data-cy="no-suggestions-message"
              >
                No matching suggestions
              </div>
            )}

            {suggestions.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
