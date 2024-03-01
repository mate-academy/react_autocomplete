import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ onSelected }) => {
  const [showPeople, setShowPeople] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [applyedQuery, setApplyQuery] = useState('');

  const applyQuery = useCallback(debounce(setApplyQuery, 1000), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  const handleInputFocus = useCallback(() => {
    if (!inputValue) {
      setShowPeople(!showPeople);
    }
  }, []);

  const handleSuggestionClick = (selectedPerson: Person) => {
    setShowPeople(false);
    setInputValue(selectedPerson.name);
    onSelected(selectedPerson);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [applyedQuery]);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputFocus}
            data-cy="search-input"
          />
        </div>

        {showPeople && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeople.length ? (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    style={{ cursor: 'pointer' }}
                    key={person.name}
                    onClick={() => handleSuggestionClick(person)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSuggestionClick(person);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
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
            )}
          </div>
        )}
      </div>
    </>
  );
};
