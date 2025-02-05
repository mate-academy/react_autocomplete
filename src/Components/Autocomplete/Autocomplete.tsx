import { useEffect, useRef, useState } from 'react';
import { Person } from '../../types/Person';

type AutocompleteProps = {
  persons: Person[];
  delay: number;
  setSelectedPerson: (person: Person | undefined) => void;
  handleFiltered: (newValue: string) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  persons,
  delay,
  setSelectedPerson,
  handleFiltered,
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
        setValue(value);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value, persons]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = (newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleFiltered(newValue.trim());
    }, delay);
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
          onChange={event => {
            const newValue = event.target.value;

            setValue(newValue);
            debounce(newValue);
            setSelectedPerson(undefined);
          }}
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
                    onClick={() => {
                      setSelectedPerson(person);
                      setValue(person.name);
                      setIsOpen(false);
                    }}
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
