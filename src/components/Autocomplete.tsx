import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

interface Props {
  people: Person[];
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
  onInputChange?: () => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  debounceDelay = 300,
  onSelected,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastSearchedText, setLastSearchedText] = useState('');

  const filterPeople = useCallback(
    (text: string) => {
      const lower = text.toLowerCase();
      const filtered = people.filter(ppl =>
        ppl.name.toLowerCase().includes(lower),
      );

      setSuggestions(filtered);
    },
    [people],
  );

  const debounceFilter = useMemo(
    () => debounce(filterPeople, debounceDelay),
    [filterPeople, debounceDelay],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputValue(newText);
    onInputChange?.();

    if (newText === lastSearchedText) {
      return;
    }

    setLastSearchedText(newText);
    setIsDropdownOpen(true);

    if (!newText.trim()) {
      debounceFilter.cancel();
      setSuggestions(people);
    } else {
      debounceFilter(newText);
    }
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);

    if (!inputValue.trim()) {
      setSuggestions(people);
    }
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setIsDropdownOpen(false);
    onSelected(person);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const noSuggestions = suggestions.length === 0 && inputValue.trim();

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                onClick={() => handleSelect(person)}
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {noSuggestions && (
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
  );
};

export default Autocomplete;
