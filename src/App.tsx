import React, { useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [debounceDelay, setDebounceDelay] = useState(1000);
  const [selectedPerson, setSelectedPerson] = useState({
    ...peopleFromServer[0],
    name: 'No selected person',
  });
  const { name, born, died } = selectedPerson;
  const applyedQuery = useCallback(
    debounce(setApplyQuery, debounceDelay),
    [debounceDelay],
  );

  const visiblePeople = useMemo(() => {
    if (applyQuery === '') {
      return [];
    }

    const peoples = peopleFromServer.filter(el => (
      el.name.toLocaleLowerCase()
        .includes(applyQuery.toLocaleLowerCase().trim())
    ));

    if (peoples.length === 0) {
      return [{
        ...peopleFromServer[0],
        name: 'No matching suggestions',
        sex: 'no',
      }];
    }

    return peoples;
  }, [peopleFromServer, applyQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {name === 'No selected person' ? name : `${name} (${born} = ${died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={e => {
              setDebounceDelay(1000);
              setQuery(e.target.value);
              applyedQuery(e.target.value);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {visiblePeople.length !== 0 && (
            <div className="dropdown-content">
              {visiblePeople.map(el => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={el.name}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedPerson(el);
                    setQuery(el.name);
                    setApplyQuery('');
                  }}
                >
                  <p
                    className={classNames(
                      { 'has-text-link': el.sex === 'm' },
                      { 'has-text-danger': el.sex === 'f' },
                      { 'has-text-grey-light': el.sex === 'no' },
                    )}
                  >
                    {el.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
