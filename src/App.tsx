import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import cn from 'classnames';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('No selected person');
  const [titleSelectPerson, setTitleSelectPerson] = useState('');
  const [hasErrorInput, setHasErrorInput] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const applyInput = useCallback(debounce(setInputText, 300), []);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(inputText.toLowerCase()),
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyInput(event.target.value);
    setInputText(event.target.value);

    const hasMatch = peopleFromServer.some(person =>
      person.name
        .toLowerCase()
        .includes(event.target.value.trim().toLowerCase()),
    );

    setHasErrorInput(hasMatch);
  };

  const suggesName = (person: Person) => {
    setSelectedPerson(`${person.name} (${person.born} - ${person.died})`);

    setInputText(person.name);
    setTitleSelectPerson(person.name);
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (inputText !== titleSelectPerson) {
      setDropdownVisible(false);
      setSelectedPerson('No selected person');
    }

    if (selectedPerson === 'No selected person') {
      setDropdownVisible(true);
    }
  });

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson}
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': dropdownVisible,
          })}
        >
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
              {filteredPeople.map((people, index) => (
                <div
                  className="dropdown-item"
                  key={index}
                  data-cy="suggestion-item"
                  onClick={() => suggesName(people)}
                >
                  <p className="has-text-link">{people.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hasErrorInput && (
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
