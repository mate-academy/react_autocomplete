//eslint-disable
import React, { useMemo, useCallback, useRef, useState } from 'react';

import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

interface Props {
  onSelected: (person: Person | null) => void;
}

export const AutoComplite: React.FC<Props> = ({ onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [showValues, setShowValues] = useState(false);
  const dropDown = useRef(null);

  const applyListPerson = useCallback(() => {
    setShowValues(true);
  }, []);

  const debouceApplyList = debounce(applyListPerson, 300);

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  const handleInputChange = (el: React.ChangeEvent<HTMLInputElement>) => {
    debouceApplyList();
    setInputValue(el.target.value);
    setShowValues(false);
    onSelected(null);
  };

  const handleInputOnFocus = () => {
    if (!inputValue) {
      setShowValues(true);
    }
  };

  const handleSuggestionClick = (selectedPerson: Person) => {
    setInputValue(selectedPerson.name);
    setShowValues(false);
    onSelected(selectedPerson);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowValues(false);
    }, 300);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          ref={dropDown}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputOnFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {showValues && (
          <div className="dropdown-content">
            {filteredPerson.length ? (
              filteredPerson.map(currentPeople => (
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
