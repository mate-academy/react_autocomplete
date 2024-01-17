import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputText(newText);

    setSelectedPerson(null);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    setSuggestions([]);
  };

  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    if (inputFocused) {
      debounceTimeout = setTimeout(() => {
        const filteredSuggestions: Person[] = peopleFromServer.filter(
          (person) => person.name
            .toLowerCase().includes(inputText.toLowerCase()),
        );

        setSuggestions(filteredSuggestions);
      }, 1000);
    }

    return () => clearTimeout(debounceTimeout);
  }, [inputText, inputFocused]);

  const handleSuggestionClick = (person: Person) => {
    setSelectedPerson(person);
    setInputText(person.name);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    if (e.key === 'Enter') {
      handleSuggestionClick(person);
    }
  };

  const selectedPersonData = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <main className="section">
      <h1 className="title">
        {selectedPersonData}
      </h1>

      <div className="dropdown is-active" role="listbox">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!suggestions.length && inputText && (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}

            {suggestions.map((person) => (
              <div
                key={person.name}
                className={classNames('dropdown-item', {
                  'has-text-link': person === selectedPerson,
                  'cursor-pointer': true,
                })}
                role="option"
                aria-selected={person === selectedPerson ? 'true' : 'false'}
                tabIndex={0}
                onClick={() => handleSuggestionClick(person)}
                onKeyDown={(e) => handleKeyDown(e, person)}
              >
                <p>{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
