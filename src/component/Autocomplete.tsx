import { Person } from '../types/Person';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { debounce } from 'lodash';

type Props = {
  peoples: Person[];
  handlePeople: (name: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ peoples, handlePeople }) => {
  const [query, setQuery] = useState('');
  const [previousQuery, setPreviousQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [defaultPlaceHolder, setdefaultPlaceHolder] = useState(
    'Enter a part of the name',
  );

  useEffect(() => {
    const debouncedSetQuery = debounce(value => {
      setPreviousQuery(value);
    }, 300);

    debouncedSetQuery(query);

    return () => {
      debouncedSetQuery.cancel();
    };
  }, [query]);

  const filteredPeople = useMemo(() => {
    return peoples.filter(people => {
      const registredPeople = people.name.toLowerCase().trim();
      const queryPeople = previousQuery.toLowerCase().trim();

      return registredPeople.includes(queryPeople);
    });
  }, [previousQuery, peoples]);

  const handleQueryUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    if (query === '' || query) {
      setIsFocused(true);
    }

    if (selectedPerson) {
      setdefaultPlaceHolder('No selected person');
      setSelectedPerson(null);
      handlePeople(null);
    }
  };

  const handlePeopleName = (person: Person) => {
    setdefaultPlaceHolder(person.name);
    setSelectedPerson(person);
    handlePeople(person);
    setIsFocused(false);
  };

  const toggleList = () => {
    setIsFocused(prev => !prev);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder={defaultPlaceHolder}
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryUsers}
          onFocus={toggleList}
        />
      </div>
      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        ref={dropdownRef}
      >
        <div className="dropdown-content">
          {isFocused &&
            filteredPeople.map((people: Person) => {
              return (
                <div
                  key={uuidv4()}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handlePeopleName(people)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{people.name}</p>
                </div>
              );
            })}
        </div>
      </div>
      {filteredPeople.length === 0 && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
