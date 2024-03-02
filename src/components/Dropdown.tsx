import React, { useMemo, useState } from 'react';

import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface Props {
  onSelected: (person: Person | null) => void;
  people: Person[];
}

export const Dropdown: React.FC<Props> = ({ onSelected, people }) => {
  const [inputValue, setInputValue] = useState('');
  const [isShowPeople, setIsShowPeople] = useState(false);

  const debounceTime = 300;

  const filteredPersons = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [people, inputValue]);

  const setDebounce = useMemo(() => {
    return debounce(() => setIsShowPeople(true), debounceTime);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebounce();

    if (e.target.value !== ' ') {
      setInputValue(e.target.value);
    }

    setIsShowPeople(false);
    onSelected(null);
  };

  const handleSelectedPerson = (selectedPersonArg: Person) => {
    setInputValue(selectedPersonArg.name);
    setIsShowPeople(false);
    onSelected(selectedPersonArg);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsShowPeople(false);
    }, debounceTime);
  };

  const handleResetButton = () => {
    setInputValue('');
    onSelected(null);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          style={{
            display: 'flex',
            position: 'relative',
            width: '16rem',
          }}
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsShowPeople(true)}
          onBlur={handleInputBlur}
        />
        {inputValue && (
          <button
            type="button"
            className="delete is-small"
            onClick={handleResetButton}
            style={{
              display: 'flex',
              position: 'absolute',
              left: '14.3rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            aria-label="Clear input"
          />
        )}
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {isShowPeople && (
          <div className="dropdown-content">
            {filteredPersons.length ? (
              filteredPersons.map(currentPerson => (
                <div
                  style={{ cursor: 'pointer' }}
                  key={currentPerson.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelectedPerson(currentPerson)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSelectedPerson(currentPerson);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <p className="has-text-link">{currentPerson.name}</p>
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
