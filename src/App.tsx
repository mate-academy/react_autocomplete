import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputText(newText);

    setSelectedPerson(null);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filteredSuggestions: Person[] = peopleFromServer.filter(
        (person) => person.name.toLowerCase().includes(inputText.toLowerCase()),
      );

      setSuggestions(filteredSuggestions);
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [inputText]);

  const handleSuggestionClick = (person: Person) => {
    setSelectedPerson(person);
    setInputText(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active" role="listbox">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={handleInputChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {inputText === '' && (
              <div className="dropdown-item">
                <p className="has-text-link">Show all people</p>
              </div>
            )}
            {suggestions.length === 0 && inputText !== '' && (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}

            {suggestions.map((person) => (
              <div
                key={person.name}
                className="dropdown-item"
                role="option"
                aria-selected={person === selectedPerson ? 'true' : 'false'}
                tabIndex={0}
                onClick={() => handleSuggestionClick(person)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSuggestionClick(person);
                  }
                }}
              >
                <p className={person === selectedPerson ? 'has-text-link' : ''}>
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
