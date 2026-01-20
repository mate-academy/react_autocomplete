import { useEffect, useRef, useState } from 'react';
import { AutocompleteProps, Person } from './types/Person';

export const Autocomplete = ({
  items,
  onSelected,
  delay = 300,
}: AutocompleteProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedWasSetRef = useRef(false);
  const prevNormalizedRef = useRef<string>('');
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsOpen(true);

    const normalized = value.trim().toLowerCase();

    if (selectedWasSetRef.current && normalized !== prevNormalizedRef.current) {
      selectedWasSetRef.current = false;
      onSelected(null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);

    if (inputValue.trim() === '') {
      setSuggestions(items);
    }
  };

  const handleSelect = (person: Person) => {
    const normalized = person.name.trim().toLowerCase();

    selectedWasSetRef.current = true;

    setInputValue(person.name);
    setIsOpen(false);
    prevNormalizedRef.current = normalized;

    onSelected(person);
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current as ReturnType<typeof setTimeout>);
    }

    timerRef.current = setTimeout(() => {
      const normalized = inputValue.trim().toLowerCase();

      if (normalized === prevNormalizedRef.current) {
        return;
      }

      prevNormalizedRef.current = normalized;

      if (normalized === '') {
        if (isOpen) {
          setSuggestions(items);
        } else {
          setSuggestions([]);
        }

        return;
      }

      setSuggestions(
        items.filter(p => p.name.toLowerCase().includes(normalized)),
      );
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue, items, delay, isOpen]);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={event => handleInputChange(event.target.value)}
          onFocus={handleInputFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map(p => (
            <div
              key={p.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={eventChange => {
                eventChange.preventDefault();
                handleSelect(p);
              }}
            >
              <p>{p.name}</p>
            </div>
          ))}
          {isOpen && suggestions.length === 0 && (
            <div
              className="dropdown-item has-text-grey"
              data-cy="no-suggestions-message"
            >
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
