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
  const [counter, setCounter] = useState(0);

  const selectPerson = useMemo(() => {
    const searchQuery = applyQuery.trim().toLowerCase();

    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(searchQuery),
    );
  }, [applyQuery]);

  const appliedQuery = useCallback(
    debounce(setApplyQuery, 1000), [],
  );

  const clearSearch = () => {
    setVisibleName(false);
    setSelectName(null);
    setQuery('');
    setCounter(0);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setQuery(event.target.value);
    appliedQuery(event.target.value);
    setVisibleName(true);
  };

  const setPersonName = (person: Person) => {
    if (person) {
      setSelectName(person);
      setQuery(person.name);
      setVisibleName(false);
    }
  };

  const onFocus = () => {
    if (counter % 2 === 0 && !selectName && !applyQuery) {
      setVisibleName(true);
      setCounter(count => count + 1);
    }

    if (counter % 2 !== 0 && !selectName && !applyQuery) {
      setVisibleName(false);
      setCounter(count => count - 1);
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
        <div
          className="dropdown-trigger control has-icons-right"
          aria-controls="dropdown-menu"
          aria-haspopup="true"
        >
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={handleQuery}
            onClick={onFocus}
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
            ) : selectPerson.map((person) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                className="dropdown-item"
                key={person.slug}
                onClick={() => setPersonName(person)}
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
