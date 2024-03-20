import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Dropdowns } from './Components/Dropdowns';
import { Person } from './types/Person';
import { ErrorMessage } from './Components/ErrorMessage';
import { debounce, filterPeople } from './functions';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [displayOptions, setDisplayOptions] = useState(false);

  const applyQuerty = useCallback(debounce(setAppliedQuery, 1000), []);

  //#region handleChange
  const handleQuertyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuerty(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleQuertyChange(event);
    setSelectedPerson(null);
  };
  //#endregion

  const displayedSuggestions = useMemo(() => {
    return filterPeople(appliedQuery);
  }, [appliedQuery]);

  const hasSuggestions = displayedSuggestions.length >= 1;

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
              value={selectedPerson?.name || query}
              onChange={handleInputChange}
              onFocus={() => setDisplayOptions(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {displayOptions &&
              !selectedPerson &&
              (hasSuggestions ? (
                <Dropdowns
                  suggestions={displayedSuggestions}
                  setSelectedPerson={setSelectedPerson}
                />
              ) : (
                <ErrorMessage />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};
