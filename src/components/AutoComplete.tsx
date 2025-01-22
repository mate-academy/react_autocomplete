import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { useClickOutside } from '../hooks/useClickOutside';

interface Props {
  onSelected?: (person: Person | null) => void;
  selectedPerson: Person | null;
  debounceDelay?: number;
  people: Person[];
}

export const AutoComplete: React.FC<Props> = ({
  onSelected = () => {},
  selectedPerson,
  debounceDelay = 300,
  people,
}) => {
  const [isDropdownOpened, setIsDropdownOpened] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<Person[]>(people);

  const noSuggestions =
    inputValue.trim() && filteredSuggestions.length === 0 && isDropdownOpened;
  const isDropDownContentVisible =
    isDropdownOpened && filteredSuggestions.length > 0;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  useClickOutside(dropdownRef, () => setIsDropdownOpened(false));

  const debouncedFilter = debounce((value: string) => {
    const normalizedInput = value.toLowerCase().trim();

    if (normalizedInput === '') {
      setFilteredSuggestions(people);
    } else {
      const matches = people.filter(person =>
        person.name.toLowerCase().includes(normalizedInput),
      );

      setFilteredSuggestions(matches);
    }
  }, debounceDelay);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);
    debouncedFilter(value);
    onSelected(null);
  };

  const onSelect = (person: Person) => {
    setInputValue(person.name);
    onSelected(person);
    setIsDropdownOpened(false);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setIsDropdownOpened(true)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>

        <div
          ref={dropdownRef}
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          {isDropDownContentVisible && (
            <div className="dropdown-content">
              {filteredSuggestions.map(person => {
                const isSelected = selectedPerson?.slug === person.slug;

                return (
                  <div
                    key={person.slug}
                    onClick={() => onSelect(person)}
                    className={cn('dropdown-item', {
                      'is-selected': isSelected,
                    })}
                    data-cy="suggestion-item"
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {noSuggestions && (
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
    </>
  );
};
