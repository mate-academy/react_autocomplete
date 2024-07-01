import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [hasShowAutocomplete, setHasShowAutocomplete] = useState(false);

  const applyQuery = useCallback(
    debounce(q => setAppliedQuery(q), 300),
    [],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== query) {
      setSelected(null);
    }

    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const onSelected = (person: Person): undefined => {
    setSelected(() => person);
    setHasShowAutocomplete(false);
  };

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.includes(appliedQuery),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected !== null
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': hasShowAutocomplete })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setHasShowAutocomplete(true)}
            />
          </div>
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPersons.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => onSelected(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!filteredPersons.length && (
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
