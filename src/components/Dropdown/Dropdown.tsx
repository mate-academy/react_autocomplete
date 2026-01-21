import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { useState, useRef, useMemo, useCallback, useEffect } from 'react';

interface DropdownProps {
  people: Person[];
  onSelected?: (person: Person | null) => void;
  delay?: number;
}

export const Dropdown = ({
  people,
  onSelected,
  delay = 300,
}: DropdownProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const previousQueryRef = useRef('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const applyFilterDebounced = useMemo(
    () =>
      debounce((value: string) => {
        const trimmedValue = value.trim();

        if (previousQueryRef.current === trimmedValue) {
          return;
        }

        previousQueryRef.current = trimmedValue;
        setAppliedQuery(trimmedValue);
      }, delay),
    [delay],
  );

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    if (onSelected) {
      onSelected(null);
    }

    if (value.trim()) {
      applyFilterDebounced(value);
    } else {
      applyFilterDebounced.cancel();
      previousQueryRef.current = '';
      setAppliedQuery('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = useCallback(
    (person: Person) => {
      setQuery(person.name);
      setIsOpen(false);

      if (onSelected) {
        onSelected(person);
      }
    },
    [onSelected],
  );

  return (
    <>
      <div
        className={`dropdown ${isOpen ? 'is-active' : ''}`}
        ref={dropdownRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            ) : (
              filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleItemClick(person)}
                  style={{ cursor: 'pointer' }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
