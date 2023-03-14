/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [visiblePeople, setVisiblePeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debounce = (
    f: (...args: string[]) => void,
    delay: number,
  ) => {
    let timerId: number;

    return (...args: string[]) => {
      clearTimeout(timerId);
      timerId = window.setTimeout(f, delay, ...args);
    };
  };

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ),
    [],
  );

  const clearQuery = useCallback(() => {
    setQuery('');
    setAppliedQuery('');
  }, [appliedQuery]);

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    clearQuery();
  }, [appliedQuery, clearQuery]);

  useEffect(() => {
    setVisiblePeople(peopleFromServer.filter((person) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No person is selected')}
      </h1>

      <div
        className={cn('dropdown', {
          'is-active': appliedQuery,
        })}
      >
        <div className="dropdown-trigger">
          <div className="control has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                applyQuery(event.target.value);
              }}
            />
            {query && (
              <span
                className="icon is-right"
                style={{ pointerEvents: 'all' }}
              >
                <button
                  type="button"
                  className="delete"
                  onClick={() => clearQuery()}
                />
              </span>
            )}
          </div>

        </div>

        <DropdownMenu
          visiblePeople={visiblePeople}
          select={selectPerson}
        />
      </div>
    </main>
  );
};
