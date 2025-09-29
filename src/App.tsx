import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

const NO_SELECTED_PERSON = 'No selected person';

export const App: React.FC = () => {
  const [searchByName, setSearchByName] = useState(false);
  const [peopleTarget, setPeopleTarget] = useState(0);
  const [appliedQuery, setAppliedQuery] = useState('');

  const { name, born, died } = peopleFromServer[peopleTarget];

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), [
    setAppliedQuery,
  ]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setSearchByName(true);
  };

  const filterList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handlePeopleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const select = peopleFromServer.findIndex(
      person => person.name === event.target.value,
    );

    setPeopleTarget(select);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {peopleTarget === 0
            ? NO_SELECTED_PERSON
            : `${name} (${born} - ${died})`}
        </h1>
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onClick={() => setSearchByName(true)}
          onChange={handleQueryChange}
        />

        <div
          className={classNames({
            'dropdown-menu': searchByName === false,
          })}
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            <select
              className="dropdown-item"
              data-cy="suggestions-list"
              onChange={handlePeopleSelect}
            >
              {filterList.map(person => (
                <option
                  data-cy="suggestion-item"
                  value={person.name}
                  key={person.name}
                >
                  {person.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filterList.length === 0 && (
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
