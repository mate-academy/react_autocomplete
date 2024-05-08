import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>(peopleFromServer);

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
  };

  const handleSuggestionClick = (person: Person) => {
    setInputText(person.name);
    setSelectedPerson(person);
    setSuggestions([]);
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
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputText}
              onChange={handleInputChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
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
        </div>

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
      </main>
    </div>
  );
};

export default App;
