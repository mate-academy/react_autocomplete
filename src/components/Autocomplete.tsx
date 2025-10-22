import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  peopleFromServer: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);

  const lastQueryRef = useRef('');

  const filterPeople = (inputFilterValue: string) => {
    const trimmedValue = inputFilterValue.trim();

    if (trimmedValue === '') {
      setFilteredPeople(peopleFromServer);

      return;
    }

    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(trimmedValue.toLowerCase()),
    );

    setFilteredPeople(filtered);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setInputValue(newValue);
    onSelected(null);

    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => setIsOpen(false), 100);
  };

  useEffect(() => {
    const trimmedValue = inputValue.trim();

    if (trimmedValue === lastQueryRef.current) {
      return;
    }

    lastQueryRef.current = trimmedValue;

    const timeout = setTimeout(() => {
      filterPeople(trimmedValue);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputValue, delay, peopleFromServer]);

  const showNoResults =
    isOpen && filteredPeople.length === 0 && inputValue.trim() !== '';

  return (
    <div className={cn('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-qa="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            if (inputValue.trim() === '') {
              filterPeople('');
            }
          }}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-qa="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-qa="suggestion-item"
              onClick={() => {
                setInputValue(person.name);
                setIsOpen(false);
                onSelected(person);
              }}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}

          {showNoResults && (
            <div
              className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start
              "
              role="alert"
              data-qa="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
