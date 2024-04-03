import React, { useCallback, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

interface AutoCompleteProps {
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  onSelected,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showAllPeople, setShowAllPeople] = useState(false);
  const dropdownRef = useRef(null);

  const applyQuery = useCallback(() => {
    setShowAllPeople(true);
  }, []);

  const debouncedApplyQuery = useMemo(() => {
    return debounce(applyQuery, delay);
  }, [applyQuery, delay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trim());
    debouncedApplyQuery();
    setShowAllPeople(false);
    onSelected(null);
  };

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  const handleInputFocus = () => {
    if (!inputValue) {
      setShowAllPeople(true);
    }
  };

  const handleSuggestionClick = (selectedPersonArg: Person) => {
    setInputValue(selectedPersonArg.name);
    setShowAllPeople(false);
    onSelected(selectedPersonArg);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowAllPeople(false);
    }, 300);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          ref={dropdownRef}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {showAllPeople && (
          <div className="dropdown-content">
            {filteredPersons.length ? (
              filteredPersons.map(currentPeople => (
                <div
                  style={{ cursor: 'pointer' }}
                  key={currentPeople.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestionClick(currentPeople)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSuggestionClick(currentPeople);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <p className="has-text-link">{currentPeople.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
