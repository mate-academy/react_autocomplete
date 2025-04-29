import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  let timerId: number;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filterPeople = useCallback(
    (searchText: string) => {
      const normalized = searchText.trim().toLowerCase();

      if (normalized === '') {
        setSuggestions(people);

        return;
      }

      const filtered = people.filter(person => {
        return person.name.toLowerCase().includes(normalized);
      });

      setSuggestions(filtered);
    },
    [people],
  );

  const debouncedFilter = useMemo(
    () => debounce(filterPeople, delay),
    [filterPeople, delay],
  );

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
    debouncedFilter(value);
    setIsDropdownOpen(true);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div
        className={`dropdown ${isDropdownOpen && suggestions.length > 0 ? 'is-active' : ''}`}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={inputChange}
            onFocus={() => {
              debouncedFilter(inputValue);
              setIsDropdownOpen(true);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDropdownOpen && suggestions.length === 0 && (
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
