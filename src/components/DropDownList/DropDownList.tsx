import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

import { Person } from '../../types/Person';

interface People {
  peopleList: Person[];
  setCurrentPerson: (person: Person) => void;
  delay: number;
}

export const DropDownList: React.FC<People> = ({
  peopleList,
  setCurrentPerson,
  delay,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    const arrayOfPeople = peopleList.filter((item: Person) => {
      return item.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });

    return arrayOfPeople;
  }, [appliedQuery, peopleList]);

  const debounceHandler = useMemo(() => debounce((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputText(event.target.value);
    setAppliedQuery(event.target.value);
  }, delay),
  [delay, setAppliedQuery, setInputText]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      debounceHandler(event);
    },
    [debounceHandler],
  );

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

  const handleItemClick = (person: Person) => {
    setSelectedPerson(person);
    setCurrentPerson(person);
    setInputText('');
    setIsFocused(false);
    setAppliedQuery('');
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
            {filteredPeople.length !== 0 ? (
              filteredPeople.map((person: Person) => (
                <div
                  className={`dropdown-item ${selectedPerson === person ? 'selected' : ''}`}
                  key={person.name}
                  onClick={() => handleItemClick(person)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleItemClick(person);
                    }
                  }}
                  role="menuitem"
                  tabIndex={0}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
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
