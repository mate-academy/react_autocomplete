import React, { useEffect, useRef, useState } from 'react';
import './Autocomplete.scss';
import { Person } from '../../types/Person';
import classNames from 'classnames';

interface AutocompleteProps {
  people: Person[];
  onSearch: (filteredPeople: Person[], searchedValue: string) => void;
  onSelected: (person: Person | null) => void;
  delay?: number;
  selectedPerson: Person | null;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSearch,
  onSelected,
  delay = 300,
  selectedPerson,
}) => {
  const timerId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [visibleListOfPeople, setVisibleListOfPeople] =
    useState<Person[]>(people);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (selectedPerson) {
      setInputValue(selectedPerson.name);
    }
  }, [selectedPerson]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const partOfName = event.target.value.trim();

    onSelected(null);
    setInputValue(partOfName);

    window.clearTimeout(timerId.current);

    setVisibleListOfPeople([]);

    timerId.current = window.setTimeout(() => {
      if (partOfName === inputValue) {
        return;
      }

      const filteredPeople = people.filter((person: Person) =>
        person.name.toLowerCase().includes(partOfName.toLowerCase()),
      );

      setVisibleListOfPeople(filteredPeople);
      onSearch(filteredPeople, partOfName);
    }, delay);
  };

  const handleInputFocus = () => {
    if (!inputRef.current?.value) {
      onSearch(people, '');
    }

    setIsInputFocused(true);
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setIsInputFocused(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, delay);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={inputRef}
        />
      </div>

      {isInputFocused && visibleListOfPeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visibleListOfPeople.map((person: Person) => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
