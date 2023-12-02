import cn from 'classnames';
import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { debounce } from './helpers';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [queryIsProcessed, setQueryIsProcessed] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const peopleToView = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const applyQuery = useMemo(
    () => debounce((newQuery: string) => {
      setAppliedQuery(newQuery);
      setQueryIsProcessed(true);
    }, 1000),
    [],
  );

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryIsProcessed(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonClicked = (person: Person) => {
    setSelectedPerson(person);
    setInputIsFocused(false);
    setQuery(person.name);
    setAppliedQuery(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={cn('dropdown', {
          'is-active': inputIsFocused && queryIsProcessed,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChangeQuery}
            onFocus={() => setInputIsFocused(true)}
            onBlur={() => setTimeout(() => setInputIsFocused(false), 200)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {peopleToView.length === 0 ? (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            ) : (
              peopleToView.map((person: Person) => (
                <div
                  aria-hidden
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => handlePersonClicked(person)}
                >
                  <p className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}>
                    {person.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
