import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  onInputChange: () => void;
  debounceDelay?: number;
};

export const DropdownItem: React.FC<Props> = ({
  people,
  onSelect,
  onInputChange,
  debounceDelay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);

  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        const trimmed = value.trim();

        if (trimmed === '') {
          setFilteredPeople(people);

          return;
        }

        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(trimmed.toLowerCase()),
          ),
        );
      }, debounceDelay),
    [people, debounceDelay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);
    onInputChange();
    debouncedFilter(value);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setFilteredPeople([]);
    onSelect(person);
  };

  const showNoSuggestions =
    inputValue.trim() !== '' && filteredPeople.length === 0;

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
          onFocus={() => debouncedFilter(inputValue)}
        />
      </div>

      {filteredPeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNoSuggestions && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
