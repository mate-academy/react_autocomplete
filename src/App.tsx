import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocusedInput, setIsFocusedInput] = useState(false);

  const aplyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = ((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    aplyQuery(event.target.value);

    if (event.target.value === appliedQuery) {
      aplyQuery.cancel();
    }

    setQuery(event.target.value);
  });

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.includes(appliedQuery))
      .map(person => {
        return (
          <>
            <a
              key={person.slug}
              href="/#"
              onClick={() => {
                setSelectedPerson(person);
                setQuery(person.name);
                setIsFocusedInput(false);
              }}
              className="dropdown-item"
            >
              {person.name}
            </a>

            <hr className="dropdown-divider" />
          </>
        );
      });
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn(
        'dropdown',
        { 'is-active': isFocusedInput },
      )}
      >
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={(event => handleQueryChange(event))}
            onFocus={() => setIsFocusedInput(true)}
          />
        </div>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length
              ? filteredPeople
              : (
                <div
                  className="dropdown-item"
                >
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
