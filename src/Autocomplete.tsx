import { useMemo, useRef, useState } from 'react';
import { Person } from './types/Person';

export const Autocomplete = ({
  peopleFromServer,
  delay = 300,
  onSelected,
  onInputChange,
}: {
  peopleFromServer: Person[];
  delay: number;
  onSelected: (person: Person) => void;
  onInputChange: (value: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [appliedValue, setAppliedValue] = useState('');
  const timerId = useRef(0);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e.target.value);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedValue(e.target.value);
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    if (appliedValue.trim() === '' && isFocused === true) {
      return peopleFromServer;
    }

    return [...peopleFromServer].filter(person =>
      person.name.toLowerCase().includes(appliedValue.toLowerCase().trim()),
    );
  }, [peopleFromServer, appliedValue, isFocused]);

  return (
    <>
      <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={e => handleInputChange(e)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <button
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => {
                  onSelected(person);
                  setInputValue(person.name);
                  setAppliedValue(person.name);
                  setIsFocused(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      {inputValue.trim() !== '' && filteredPeople.length === 0 && (
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
