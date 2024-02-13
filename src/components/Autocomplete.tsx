import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

interface AutoCompleteProps {
  onSelected: (person: Person | null) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({ onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [showAllPeople, setShowAllPeople] = useState(false);

  const applyQuery = useCallback(
    debounce(() => setShowAllPeople(true), 300),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery();
    setInputValue(e.target.value);
    setShowAllPeople(false);
  };

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(inputValue.toLowerCase()));
  }, [inputValue]);

  const handleInputFocus = () => {
    if (inputValue === '') {
      setShowAllPeople(true);
    }
  };

  const handleSuggestionClick = (selectedPerson: Person) => {
    setInputValue(selectedPerson.name);
    setShowAllPeople(false);
    onSelected(selectedPerson);
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
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        {showAllPeople && (
          <div className="dropdown-content">
            {filteredPersons.length > 0
              ? filteredPersons.map((currentPeople) => (
                <div
                  style={{ cursor: 'pointer' }}
                  key={currentPeople.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestionClick(currentPeople)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSuggestionClick(currentPeople);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <p className="has-text-link">
                    {currentPeople.name}
                  </p>
                </div>
              ))
              : (
                <div
                  className="dropdown-item"
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
