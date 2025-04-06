import { useEffect, useState, useRef } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  selectedPerson,
  onSelected,
  debounceDelay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Person[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchedValueRef = useRef<string>('');

  const handleSelect = (person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (
      selectedPerson &&
      inputValue.trim() !== '' &&
      inputValue !== selectedPerson.name
    ) {
      onSelected(null);
    }
  }, [inputValue, selectedPerson, onSelected]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const trimmed = inputValue.trim();

      if (trimmed === '') {
        setFilteredSuggestions(people);

        return;
      }

      if (trimmed === lastSearchedValueRef.current) {
        return;
      }

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(trimmed.toLowerCase()),
      );

      setFilteredSuggestions(filtered);
      lastSearchedValueRef.current = trimmed;
    }, debounceDelay);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue, people, debounceDelay]);

  return (
    <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredSuggestions.length === 0 && inputValue.trim() !== '' ? (
            <div
              className="notification
              is-danger is-light mt-3 is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : (
            filteredSuggestions.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                {person.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
