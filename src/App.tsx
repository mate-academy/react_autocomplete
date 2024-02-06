import React, { useCallback, useState, useMemo } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { ListUser } from './component/ListUser';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('No selected person');
  const [active, setActive] = useState(false);
  const [appQuery, setAppQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(value => {
    setAppQuery(value);
    setTitle('No selected person');
  }, 1000), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setTitle('No selected person');
    setQuery(newQuery);
    applyQuery(newQuery);
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
                setActive={setActive}
                setQueryData={setQuery}
                setTitle={setTitle}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
