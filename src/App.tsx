import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>(peopleFromServer);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    const delayedFilter = debounce((text: string) => {
      setSuggestions(
        peopleFromServer.filter((person: Person) =>
          person.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }, 300);

    setInputText(newText);
    setSelectedPerson(null);
    if (!newText) {
      setSuggestions(peopleFromServer);
    }

    delayedFilter(newText);
    setShowSuggestions(true); // Показувати підказки, коли змінюється вміст введення
  };

  const handleSuggestionClick = (person: Person) => {
    setInputText(person.name);
    setSelectedPerson(person);
    setShowSuggestions(false); // Приховати підказки після вибору
  };

  const pageTitle = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {pageTitle}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger" ref={inputRef}>
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputText}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
            />
          </div>

          {showSuggestions && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
              ref={suggestionsRef}
            >
              <div className="dropdown-content">
                {suggestions.map((person, index) => (
                  <div
                    className="dropdown-item"
                    key={index}
                    data-cy="suggestion-item"
                    onClick={() => handleSuggestionClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inputText && suggestions.length === 0 && (
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
        </div>
      </main>
    </div>
  );
};

export default App;
