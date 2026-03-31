import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { SuggestionList } from './component/SuggestionList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(inputValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {isFocused && (
            <SuggestionList
              people={filteredPeople}
              onSelect={person => {
                setSelectedPerson(person);
                setInputValue(person.name);
                setIsFocused(false);
              }}
            />
          )}
        </div>
        {filteredPeople.length === 0 && (
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
