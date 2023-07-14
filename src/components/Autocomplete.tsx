import React, { useState, useMemo, useEffect } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
}

const filterPeople = (arr: Person[], searchTerm: string) => {
  if (searchTerm.trim()) {
    return arr.filter(({ name }) => (
      name.toLowerCase().includes(searchTerm.trim().toLowerCase())));
  }

  return [];
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  delay = 1000,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toCloseMenu, setToCloseMenu] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const filteredPeople = useMemo(() => (
    filterPeople(people as Person[], searchTerm)),
  [debouncedSearchTerm]);

  const toShowError = searchTerm !== ''
    && filteredPeople.length === 0
    && debouncedSearchTerm === searchTerm;

  const toShowMenu = searchTerm !== ''
    && filteredPeople.length > 0
    && debouncedSearchTerm === searchTerm
    && !toCloseMenu;

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setToCloseMenu(false);
  };

  const onOptionSelect = (event: React.MouseEvent, person: Person) => {
    event.preventDefault();

    setSearchTerm(person.name);
    setToCloseMenu(true);

    onSelect(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={searchTerm}
          onChange={onInputChange}
        />
      </div>

      {toShowError && (
        <h2 className="dropdown-menu">
          No matching suggestions
        </h2>
      )}

      {toShowMenu && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <a
                href="/#"
                className="dropdown-item"
                key={person.name}
                onClick={(event) => onOptionSelect(event, person)}
              >
                <p className={person.sex === 'm'
                  ? 'has-text-link'
                  : 'has-text-danger'}
                >
                  {person.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
