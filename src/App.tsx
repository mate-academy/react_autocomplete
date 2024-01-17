import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputText(newText);

    setSelectedPerson(null);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        e.relatedTarget
        && e.currentTarget.contains(e.relatedTarget as Node)
      ) {
        return;
      }

      setInputFocused(false);
      setSuggestions([]);
    }, 200);
  };

  useEffect(() => {
    const fetchSuggestions = () => {
      const filteredSuggestions: Person[] = peopleFromServer.filter(
        (person) => person.name.toLowerCase().includes(inputText.toLowerCase()),
      );

      setSuggestions(filteredSuggestions);
    };

    const timeoutId = setTimeout(() => {
      if (inputFocused && inputRef.current) {
        fetchSuggestions();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [inputText, inputFocused]);

  const handleSuggestionClick = (person: Person) => {
    setSelectedPerson(person);
    setInputText(person.name);
    setSuggestions([]);
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
            ref={inputRef}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={e => handleInputBlur(e)}
          />
        </div>

        {inputFocused && suggestions.length > 0 && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
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
        )}
      </div>
    </main>
  );
};
