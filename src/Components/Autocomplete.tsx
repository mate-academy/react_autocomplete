import React, { useMemo, useState, useEffect } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};
export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);

  const debouncedFilter = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value.trim()), delay),
    [delay],
  );

  useEffect(() => () => debouncedFilter.cancel(), [debouncedFilter]);

  const filteredPeople = useMemo(() => {
    const inputQuery = debouncedQuery.trim().toLowerCase();

    if (!inputQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(inputQuery),
    );
  }, [debouncedQuery, people]);

  const handleChange = (value: string) => {
    if (selected && value !== selected.name) {
      setSelected(null);
      onSelected(null);
    }

    setIsOpen(true);
    setInputValue(value);

    if (!value.trim()) {
      return;
    }

    if (value.trim() !== debouncedQuery.trim()) {
      debouncedFilter.cancel();
      debouncedFilter(value);
    }
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setDebouncedQuery(person.name);
    setSelected(person);
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={event => handleChange(event.target.value)}
            onFocus={() => {
              setIsOpen(true);
              debouncedFilter.cancel();
              if (!inputValue.trim()) {
                setInputValue('');
              } else {
                debouncedFilter(inputValue);
              }
            }}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isOpen && filteredPeople.length === 0 && (
        <div
          data-cy="no-suggestions-message"
          className="notification is-danger
          is-light mt-3 is-align-self-flex-start"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
