import { useCallback, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

interface Props {
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({ onSelected }) => {
  const [input, setInput] = useState('');
  const [showPeopel, setShowPeople] = useState(false);
  const dropdownRef = useRef(null);

  const applyQuery = useCallback(() => {
    setShowPeople(true);
  }, []);

  const debouncedApplyQuery = debounce(applyQuery, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedApplyQuery();
    setInput(e.target.value);
    setShowPeople(false);
    onSelected(null);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(input.toLowerCase()),
    );
  }, [input]);

  const handleInputFocus = () => {
    if (!input) {
      setShowPeople(true);
    }
  };

  const handleSuggestion = (selectedPerson: Person) => {
    setInput(selectedPerson.name);
    setShowPeople(false);
    onSelected(selectedPerson);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowPeople(false);
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
          value={input}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {showPeopel && (
          <div className="dropdown-content">
            {filterPeople.length ? (
              filterPeople.map(currentPeople => (
                <div
                  style={{ cursor: 'pointer' }}
                  key={currentPeople.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestion(currentPeople)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSuggestion(currentPeople);
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
