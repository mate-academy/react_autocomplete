import { useEffect, useRef, useState } from 'react';
import { Person } from '../../types/Person';

type AutocompleteProps = {
  persons: Person[];
  delay?: number;
  onSelect: (person: Person | undefined) => void;
  onChange: (newValue: string) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  persons,
  delay = 300,
  onSelect,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (newValue: string) => {
    setValue(newValue);
    onSelect(undefined);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue.trim());
    }, delay);
  };

  const handlePersonChange = (selectedPerson: Person) => {
    onSelect(selectedPerson);
    setValue(selectedPerson.name);
    setIsOpen(false);
  };

  return (
    <div className="dropdown is-active" ref={dropdownRef}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={event => handleInputChange(event.target.value)}
          onClick={() => {
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
        />
      </div>

      {isOpen && persons.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {persons.map(person => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                >
                  <p
                    className="has-text-link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handlePersonChange(person)}
                  >
                    {person.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
