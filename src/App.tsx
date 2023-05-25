import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

// type Persons = {
//   peopleFromServer: Person[];
// };

const debounce = (f:(...args: string[]) => void,
  delay: number) => {
  let timerId: NodeJS.Timeout;

  return (...arg: string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...arg);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const clearHandler = () => {
    setQuery('');
    setAppliedQuery('');
  };

  const personFilter = useMemo(() => {
    return peopleFromServer.filter(
      people => people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No person is selected')}
      </h1>

      <div className={cn('dropdown', {
        'is-active': appliedQuery,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              {personFilter.map((person) => (
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    setSelectedPerson(person); clearHandler();
                  }}
                >
                  <p
                    key={person.slug}
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-success': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </button>
              ))}

              {personFilter.length === 0 && 'No matching suggestions'}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
