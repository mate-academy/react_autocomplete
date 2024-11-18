import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import classNames from 'classnames';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [normalizedQuery, setNormalizedQuery] = useState('');
  const timerId = useRef(0);
  const field = useRef<HTMLInputElement>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const saveQuery = (newQuery: string) => {
    setQuery(newQuery);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setNormalizedQuery(newQuery.trim().toLowerCase());

      if (newQuery !== normalizedQuery) {
        setSelectedPerson(null);
      }
    }, 300);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, people]);

  function onSelected(person: Person) {
    setSelectedPerson(person);
    setIsFocused(false);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={classNames('dropdown', { 'is-active': isFocused })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              ref={field}
              onFocus={() => setIsFocused(true)}
              onChange={event => saveQuery(event.target.value)}
            />
          </div>

          {filteredPeople.length > 0 && (
            <DropdownMenu
              people={filteredPeople}
              onSelected={onSelected}
              onFocus={isFocus => setIsFocused(isFocus)}
            />
          )}
        </div>

        {filteredPeople.length === 0 && (
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
