import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
}

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    typeof peopleFromServer
  >([]);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [showNoSuggestionsMessage, setShowNoSuggestionsMessage] =
    useState<boolean>(false);
  const previousSearchTerm = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm !== previousSearchTerm.current) {
        if (selectedPerson) {
          setSelectedPerson(null);
        }

        if (searchTerm) {
          const suggestions = peopleFromServer.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          setFilteredSuggestions(suggestions);
          setShowNoSuggestionsMessage(suggestions.length === 0);
        } else if (inputFocused) {
          setFilteredSuggestions(peopleFromServer);
          setShowNoSuggestionsMessage(false);
        } else {
          setFilteredSuggestions([]);
          setShowNoSuggestionsMessage(false);
        }

        previousSearchTerm.current = searchTerm;
      }
    }, debounceDelay);

    return () => clearTimeout(timerId);
  }, [searchTerm, debounceDelay, inputFocused, selectedPerson]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    if (!searchTerm) {
      setFilteredSuggestions(peopleFromServer);
    }
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    if (!searchTerm) {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setSearchTerm(person.name);
    setSelectedPerson(person);
    setFilteredSuggestions([]);
    setShowNoSuggestionsMessage(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (onSelected) {
      onSelected(person);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              ref={inputRef}
            />
          </div>

          {(searchTerm || inputFocused) && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onMouseDown={() => handleSuggestionClick(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : showNoSuggestionsMessage ? (
                  <div
                    className="dropdown-item"
                    data-cy="no-suggestions-message"
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
