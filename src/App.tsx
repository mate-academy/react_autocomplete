import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Menu } from './data/Components/Menu';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import cn from 'classnames';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = debounce((value: string) => {
    setAppliedQuery(value);
    setFocused(true);
  }, 300);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    applyQuery(event.target.value);
    setFocused(false);
  };

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().trim().includes(query.trim().toLowerCase()),
    );
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': focused })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setFocused(true)}
              onChange={handleQueryChange}
            />
          </div>
          {focused && filteredPersons.length > 0 && (
            <Menu
              setQuery={setQuery}
              setFocus={setFocused}
              onSelect={setSelectedPerson}
              list={filteredPersons}
            />
          )}
        </div>
        {filteredPersons.length <= 0 && appliedQuery && (
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
