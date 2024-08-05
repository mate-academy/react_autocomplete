import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash/debounce';
import './AutoComplete.scss';

type Props = {
  people: Person[];
  handlePeople: (person: Person | null) => void;
};

export const AutoComplete: React.FC<Props> = ({ people, handlePeople }) => {
  const [query, setQuery] = useState('');
  const [previousQuery, setPreviousQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debouncedSetQuery = debounce(value => {
      if (value !== previousQuery) {
        setPreviousQuery(value);
      }
    }, 300);

    debouncedSetQuery(query);

    return () => {
      debouncedSetQuery.cancel();
    };
  }, [query, previousQuery]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    setQuery(newQuery);
    handleFocus();
    if (selectedPerson && newQuery !== selectedPerson.name) {
      setSelectedPerson(null);
      handlePeople(null);
    }
  };

  const handleItemClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    handlePeople(person);
    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    if (query === '' && isFocused) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [people, query, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  return (
    <>
      <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list" ref={dropdownRef}>
          <div className="dropdown-content">
            {filteredPeople.map((person, index) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={index}
                onClick={() => handleItemClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
            {filteredPeople.length === 0 && (
              <div
                className="dropdown-item"
                data-cy="no-suggestions-message"
                role="alert"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
