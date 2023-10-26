import React from 'react';
import { Person } from './types/Person';

interface DropdownProps {
  isFocused: boolean;
  inputValue: string;
  filteredPeople: Person[];
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputBlur: () => void;
  handleSuggestionClick: (person: Person) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isFocused,
  inputValue,
  filteredPeople,
  handleInputChange,
  handleInputFocus,
  handleInputBlur,
  handleSuggestionClick,
}) => {
  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {(isFocused || inputValue === '') && (
          filteredPeople.length > 0 ? (
            filteredPeople.map(person => {
              const { name, sex } = person;

              return (
                <button
                  type="button"
                  className="dropdown-content"
                  key={name}
                  onClick={() => handleSuggestionClick(person)}
                >
                  <div className="dropdown-item">
                    <p className={sex === 'f'
                      ? 'has-text-danger'
                      : 'has-text-link'}
                    >
                      {name}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="dropdown-content">
              <div className="dropdown-item">
                <p className="has-text-danger">
                  No matching suggestions
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
