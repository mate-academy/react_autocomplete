import React, { useCallback, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
  debounceDelay?: number;
  people: Person[];
};

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
  debounceDelay = 300,
  people,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (selectedPerson) {
      onSelected(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    onSelected(person);
    // setIsFocused(false);
    setQuery(person.name);
  };

  const normalizedQuery = appliedQuery.trim().toLocaleLowerCase();

  const getFilteredPeople = (humans: Person[]): Person[] => {
    if (!normalizedQuery) {
      return humans;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  };

  const filteredPeople = getFilteredPeople(people);

  const noMatchingResults =
    normalizedQuery !== '' && filteredPeople.length === 0;

  return (
    <>
      <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            data-cy="search-input"
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {isFocused && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handlePersonSelect(person)}
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
        )}
      </div>

      {noMatchingResults && (
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
