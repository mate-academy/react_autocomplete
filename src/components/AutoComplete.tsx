import { useState } from 'react';
import { useRef } from 'react';
import { peopleFromServer } from './../data/people';

type Props = {
  onSelected: (selectedName: string) => void;
  debounceDelay?: number;
  onInputChange?: () => void;
};

export const AutoComplete: React.FC<Props> = ({
  onSelected,
  debounceDelay = 300,
  onInputChange,
}) => {
  const [input, setInput] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerId = useRef(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInput(value);

    if (onInputChange && value.length === 0) {
      onInputChange();
    }

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      const normalized = value.trim().toLowerCase();

      const filtered = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalized),
      );

      setFilteredPeople(filtered);
      setIsDropdownOpen(filtered.length > 0);
    }, debounceDelay);
  };

  const handleSelect = (selectedName: string) => {
    setInput(selectedName);
    setIsDropdownOpen(false);
    onSelected(selectedName);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setIsDropdownOpen(false);
      }
    }, 300);
  };

  return (
    <div
      className={`dropdown ${isDropdownOpen && filteredPeople.length > 0 ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={input}
          ref={inputRef}
          onChange={handleChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => handleSelect(person.name)}
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

      {input && filteredPeople.length === 0 && (
        <div
          className="notification
          is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
