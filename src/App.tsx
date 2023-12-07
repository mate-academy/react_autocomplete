/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { People } from './components/People';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [suggestion, setSuggestion] = useState(false);
  const [isFocued, setIsFocused] = useState(false);

  const peopleToRender = useMemo(() => {
    const filteredPeople = people.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase().trim()));

    setSuggestion(false);

    if (!filteredPeople.length) {
      setSuggestion(true);

      return [];
    }

    return filteredPeople;
  }, [appliedQuery, people]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);
  const applyFocuse = useCallback(debounce(setIsFocused, 1000), [appliedQuery]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSuggestion(false);
    setIsFocused(false);
    applyFocuse(true);
  };

  const handleOnClick = useCallback((person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  }, []);

  const handleOnBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => handleOnChange(event)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleOnBlur}
          />
        </div>

        {((query && peopleToRender && isFocued) || isFocued) && (
          <People
            people={peopleToRender}
            onClick={handleOnClick}
          />
        )}

        {(suggestion) && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
