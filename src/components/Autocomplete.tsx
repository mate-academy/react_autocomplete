import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const lastFilterRef = useRef<string>('');

  const filterPeople = useCallback(
    (value: string): Person[] => {
      if (value.trim() === '') {
        return people;
      }

      const lowerValue = value.toLowerCase();

      return people.filter(person =>
        person.name.toLowerCase().includes(lowerValue),
      );
    },
    [people],
  );

  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        if (value === lastFilterRef.current) {
          return;
        }

        lastFilterRef.current = value;
        const filtered = filterPeople(value);

        setSuggestions(filtered);
        setIsOpen(true);
      }, delay),
    [delay, filterPeople],
  );

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (selectedPerson !== null) {
      setSelectedPerson(null);
      onSelected(null);
    }

    debouncedFilter(value);
  };

  const handleFocus = () => {
    if (inputValue === '') {
      setSuggestions(people);
      setIsOpen(true);
    }
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsOpen(false);
    onSelected(person);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`} data-cy="dropdown">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  role="menuitem"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="dropdown-item"
                data-cy="no-suggestions-message"
                role="menuitem"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
