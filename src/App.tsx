import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { ListUser } from './component/components';
import { Person } from './types/Person';

function debounce(callback: any, delay:number) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('No selected person');
  const [active, setActive] = useState(false);
  const [appQuery, setAppQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | undefined>();

  const applyQuery = useCallback(debounce(setAppQuery, 1000), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuerry = event.target.value;

    setTitle('No selected person');
    setQuery(newQuerry);
    applyQuery(newQuerry);
  };

  const handleBlur = () => {
    setTimeout(() => setActive(false), 200);
  };

  const filterName = useMemo(() => {
    const queryTrim = appQuery.toLowerCase().trim();

    return peopleFromServer
      .filter(people => people.name.toLowerCase().includes(queryTrim));
  }, [appQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">

        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onFocus={() => setActive(true)}
              data-cy="search-input"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            {active && (
              <ListUser
                PersonList={filterName}
                setSelect={setSelectPerson}
                setActive={setActive}
                setQueryData={setQuery}
                setTitle={setTitle}
              />
            )}
          </div>
        </div>

        {!selectPerson && (
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
