import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import 'bulma';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function filterName(people: Person[], query: string): Person[] {
  const searchQuery = query.trim().toLowerCase();

  if (searchQuery.length) {
    return people.filter(
      person => person.name.trim().toLowerCase().includes(searchQuery),
    );
  }

  return people;
}

export const App: React.FC<Person> = () => {
  const [selectName, setSelectName] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');

  const selectPerson = useMemo(
    () => filterName(peopleFromServer, applyQuery), [applyQuery],
  );

  const appliedQuery = useCallback(
    debounce(setApplyQuery, 1000), [],
  );

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    appliedQuery(event.target.value);
  };

  const setPersonName = (person: Person | null) => {
    if (person !== null) {
      setSelectName(person);
      setQuery('');
      setApplyQuery('');
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectName
          ? `${selectName?.name} (${selectName?.born} = ${selectName?.died})`
          : 'No selected name'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {selectPerson.length === 0 ? (
              <p className="has-text-danger">
                No suggestions
              </p>
            ) : selectPerson.map((person, i) => (
              <div
                className="dropdown-item"
                key={person.slug}
                onClick={() => setPersonName(person)}
                role="button"
                onKeyDown={() => {}}
                tabIndex={i}
              >
                <p
                  style={{ cursor: 'pointer' }}
                  className={classNames({
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
