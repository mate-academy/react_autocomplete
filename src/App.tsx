import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleInputFocus = () => {
    clearTimeout(0);
    setIsFocused(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      return person.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [inputValue]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

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
              filteredPeople.map(person => (
                <button
                  type="button"
                  className="dropdown-content"
                  key={person.name}
                  onClick={() => handleSuggestionClick(person)}
                >
                  <div className="dropdown-item">
                    <p className="has-text-link">
                      {person.name}
                    </p>
                  </div>
                </button>
              ))
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
    </main>
  );
};
