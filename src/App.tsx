import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState({
    ...peopleFromServer[0],
    name: 'No selected person',
  });
  const { name, born, died } = selectedPerson;
  const debounceDelay = 1000;
  const applyedQuery = useCallback(
    debounce(setApplyQuery, debounceDelay),
    [debounceDelay],
  );

  const visiblePeopleFn = () => {
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
  };

  const visiblePeople = visiblePeopleFn();
  const handlerClick = (persone: Person) => {
    setSelectedPerson(persone);
    setQuery(persone.name);
    setApplyQuery('');
  };

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
                  onClick={() => handlerClick(el)}
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
