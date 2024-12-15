import './App.scss';
import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

const DEBOUNCE_TIME = 300;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const { name, born, died } = selectedPerson || {};

  const applyQuery = debounce(setAppliedQuery, DEBOUNCE_TIME);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);

    setSelectedPerson(null);

    applyQuery(newValue);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().trim().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const title = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className={cn('dropdown', { 'is-active': isInputFocused })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <Autocomplete people={filteredPeople} onSelect={handleSelect} />
        </div>

        {filteredPeople.length === 0 && query && (
          <div
            className="notification is-danger is-light
              mt-3 is-align-self-flex-start"
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
