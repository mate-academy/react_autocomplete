import React, { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type AutocompleteProps = {
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete = ({
  delay = 300,
  onSelected,
}: AutocompleteProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const debounceFn = useMemo(() => {
    return debounce((value: string) => {
      setDebouncedValue(current => (current === value ? current : value));
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      debounceFn.cancel();
    };
  }, [debounceFn]);

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debounceFn(e.target.value);
    onSelected(null);
  };

  const filteredPeople = useMemo(() => {
    const normalizedQuery = debouncedValue.trim().toLowerCase();

    if (!normalizedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [debouncedValue]);

  const onPersonSelect = (person: Person) => {
    setInputValue(person.name);
    onSelected(person);
    setShowDropdown(false);
    debounceFn.cancel();
    setDebouncedValue(person.name);
  };

  return (
    <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          value={inputValue}
          onChange={onChangeInputValue}
        />
      </div>

      {showDropdown &&
        (filteredPeople.length > 0 ? (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => onPersonSelect(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
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
        ))}
    </div>
  );
};
