import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [chosenPerson, setChosenPerson] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!query && !e.target.value.trim()) {
      return;
    }

    setQuery(e.target.value);
    if (e.target.value.trim() !== appliedQuery) {
      applyQuery(e.target.value);
      setChosenPerson('');
    }
  };

  const onSelected = (personName: string) => {
    setQuery(personName);
    setChosenPerson(personName);
  };

  const createTitle = (personName: string) => {
    const person = peopleFromServer.find(
      findingPerson => findingPerson.name === personName,
    );

    if (!person) {
      return personName;
    }

    return `${personName} (${person.born} - ${person.died})`;
  };

  const suggestions = useMemo(() => {
    return peopleFromServer.filter(folk => folk.name.includes(appliedQuery));
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson ? createTitle(chosenPerson) : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={onQueryChange}
            />
          </div>

          {!chosenPerson && suggestions.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {suggestions.map(suggestion => (
                  <div
                    key={suggestion.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => onSelected(suggestion.name)}
                  >
                    <p className="has-text-link">{suggestion.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {suggestions.length === 0 && (
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
