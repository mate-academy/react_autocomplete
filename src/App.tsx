import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

import debounce from 'lodash.debounce';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [applyQuery, setApplyQuery] = useState('');

  const handleSelectePerson = (person: Person | null) => {
    setSelected(person);
    setQuery(person?.name ?? '');
  };

  const applyQueryDebounced = useMemo(
    () => debounce((v: string) => setApplyQuery(v), 300),
    [],
  );

  useEffect(() => () => applyQueryDebounced.cancel(), [applyQueryDebounced]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    setSelected(null);
    applyQueryDebounced(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    const q = applyQuery.trim().toLowerCase();

    if (q === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(q),
    );
  }, [applyQuery]);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              ref={titleField}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
            />
            <Autocomplete
              people={filteredPeople}
              onSelected={handleSelectePerson}
            />
          </div>
        </div>
        {query.trim() !== '' && filteredPeople.length === 0 && (
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
