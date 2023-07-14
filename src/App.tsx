import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay: number,
}

export const App: React.FC<AppProps> = ({ debounceDelay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handlePersonChang = (person: Person) => {
    setSelectPerson(person);
    setQuery(person.name);
    setIsActive(false);
  };

  const appleyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceDelay),
    [debounceDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    appleyQuery(event.target.value);
  };

  const filterPeople = useMemo(() => {
    if (!appleyQuery) {
      setSelectPerson(null);
      setIsActive(false);
    } else {
      setIsActive(true);
    }

    return peopleFromServer.filter(people => {
      return people.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': isActive,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filterPeople.length ? (
              filterPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                >
                  <button
                    type="button"
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => handlePersonChang(person)}
                  >
                    {person.name}
                  </button>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">
                  No matching suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
