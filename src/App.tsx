import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';

import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const DELAY_FILTER_MS = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applieQuery, setApplieQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [listIsVisible, setListIsVisible] = useState(false);

  const applyQuery = useCallback(
    debounce(setApplieQuery, DELAY_FILTER_MS),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setListIsVisible(false);
  };

  const people = useMemo(() => {
    return [...peopleFromServer].filter(person => {
      const name = person.name.toLowerCase();
      const compareQuery = applieQuery.toLowerCase().trim();

      return name.includes(compareQuery);
    });
  }, [applieQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': listIsVisible })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setListIsVisible(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length === 0
              ? (
                <div className="dropdown-item">
                  <p className="has-text-primary-dark">
                    No matching suggestions
                  </p>
                </div>
              )
              : people.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => handlSelectedPerson(person)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setSelectedPerson(person);
                    }
                  }}
                  role="menuitem"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                >
                  <p className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};
