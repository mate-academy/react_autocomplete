import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import 'bulma';
import '@fortawesome/fontawesome-free/css/all.css';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectName, setSelectName] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [visibleName, setVisibleName] = useState(false);

  function filterName(people: Person[], item: string): Person[] {
    const searchQuery = item.trimStart().toLowerCase();

    if (!searchQuery) {
      setVisibleName(false);
    }

    return people.filter(
      person => person.name.toLowerCase().includes(searchQuery),
    );
  }

  const selectPerson = useMemo(
    () => filterName(peopleFromServer, applyQuery), [applyQuery],
  );

  const appliedQuery = useCallback(
    debounce(setApplyQuery, 1000), [],
  );

  const clearSearch = () => {
    setVisibleName(false);
    setSelectName(null);
    setQuery('');
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setQuery(event.target.value);
    appliedQuery(event.target.value);
    setVisibleName(true);
  };

  const setPersonName = (person: Person | null) => {
    if (person) {
      setSelectName(person);
      setQuery(person.name);
      setVisibleName(false);
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectName
          ? `${selectName.name} (${selectName.born} = ${selectName.died})`
          : 'No selected name'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': visibleName })}>
        <div className="dropdown-trigger control has-icons-right">
          <input
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleQuery}
          />

          <span
            className="icon is-small is-right"
            style={{ cursor: 'pointer' }}
            role="button"
          >
            <i
              className={`fas ${query && 'delete is-small'}`}
              onClick={clearSearch}
              onKeyDown={clearSearch}
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {selectPerson.length === 0 ? (
              <p className="has-text-danger">
                No matches
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
