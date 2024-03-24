import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

interface AutoCompleteProps {
  onSelected: (person: Person | null) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({ onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [allPeople, setAllPeople] = useState(false);
  const dropdown = useRef(null);

  const querySelected = useCallback(() => {
    setAllPeople(true);
  }, []);

  const debouncedQuery = debounce(querySelected, 300);

  const handleInputChange = (input: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(input.target.value);
    setAllPeople(false);
    debouncedQuery();
    onSelected(null);
  };

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  const handleFocus = () => {
    if (!inputValue) {
      setAllPeople(true);
    }
  };

  const handleOnClick = (selectedPerson: Person) => {
    setInputValue(selectedPerson.name);
    setAllPeople(true);
    onSelected(selectedPerson);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setAllPeople(false);
    }, 300);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          ref={dropdown}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {allPeople && (
          <div className="dropdown-content">
            {filteredPerson.length ? (
              filteredPerson.map(currentPerson => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={currentPerson.name}
                  onClick={() => {
                    handleOnClick(currentPerson);
                  }}
                >
                  <p className="has-text-link">{currentPerson.name}</p>
                </div>
              ))
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};
