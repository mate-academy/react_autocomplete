import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [dropDownVisible, setDropdownVisible] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);

  const selectedPerson = peopleFromServer.find(
    person => person.name === inputValue,
  );
  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setDropdownVisible(true);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setDropdownVisible(false);
  };

  useEffect(() => {
    const trimmedValue = inputValue.trim();

    if (trimmedValue === inputValue) {
      const handler = setTimeout(() => {
        if (trimmedValue) {
          setPeople(
            peopleFromServer.filter(person =>
              person.name.toLowerCase().includes(trimmedValue.toLowerCase())
            )
          );
        } else {
          setPeople(peopleFromServer);
        }
      }, 300);

      return () => clearTimeout(handler);
    }
  }, [inputValue]);


  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${title}`}
        </h1>

        <div className={!dropDownVisible ? 'dropdown' : 'dropdown is-active'}>
          <div className="dropdown-trigger">
            <input
              value={inputValue}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleInputChange}
              onFocus={() => setDropdownVisible(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {people.length === 0 && inputValue.trim() && (
          <div
            className="notification is-danger
            is-light mt-3 is-align-self-flex-start"
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
