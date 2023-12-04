import React, { useState } from 'react';
import { Person } from '../../types/Person';

interface People {
  filteredPeople: Person[];
  handleQueryChange: (suggest: string) => void;
  hasNoResultError: boolean;
  setCurrentPerson: (person: Person) => void;
}

const DropDownList: React.FC<People> = ({
  filteredPeople,
  handleQueryChange,
  hasNoResultError,
  setCurrentPerson,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    handleQueryChange(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setTimeout(() => {
        setIsFocused(false);
      }, 100);
    }
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setSelectedPerson(person);
    setCurrentPerson(person);
    setInputText('');
    setIsFocused(false);
    handleQueryChange('');
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      {isFocused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map((person: Person) => (
              <a
                href="/"
                className={`dropdown-item ${selectedPerson === person ? 'selected' : ''}`}
                key={person.name}
                onClick={(event) => handleItemClick(event, person)}
              >
                <p className="has-text-link">{person.name}</p>
              </a>
            ))}
            {hasNoResultError && (
              <div className="dropdown-item">
                <p className="has-text-link">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownList;
