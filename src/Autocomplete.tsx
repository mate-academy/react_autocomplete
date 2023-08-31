import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { debounce } from 'lodash';
import { Person } from './types/Person';

type AutocompleteProps = {
  people: Person[],
  onSelected: (person: Person) => void,
  debounceDelay?: number,
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  debounceDelay,
}) => {
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const debouncedQueryChange = useCallback(
    debounce((value: string) => {
      if (value !== query) {
        setQuery(value);
      }
    }, debounceDelay),
    [setQuery, debounceDelay, query],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedQueryChange(event.target.value);
    setIsOpen(true);
  };

  const filteredPeople: Person[] = people.filter((person) => {
    return person.name.toLowerCase().includes(query.toLowerCase());
  });

  const handlePersonSelect = (person: Person) => {
    setInputValue(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <div className="dropdown is-active" ref={dropdownRef}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {
              filteredPeople.length > 0
                ? filteredPeople.map(person => (
                  <div className="dropdown-item" key={person.name}>
                    <button
                      className="has-text-link"
                      onClick={() => handlePersonSelect(person)}
                      type="button"
                    >
                      {person.name}
                    </button>
                  </div>
                ))
                : (
                  <div className="dropdown-item">
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                )
            }
          </div>
        </div>
      )}
    </div>
  );
};
