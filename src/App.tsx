import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [checkedItem, setCheckedItem] = useState<Person | null>(null);
  const [inputFocus, setInputFocus] = useState(false);

  const name = checkedItem?.name;
  const born = checkedItem?.born;
  const died = checkedItem?.died;

  const [title, setTitle] = useState(
    checkedItem ? `${name} (${born} - ${died})` : 'No selected person',
  );

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLocaleUpperCase()
        .includes(appliedQuery.toLocaleUpperCase()),
    );
  }, [appliedQuery]);

  const handleChangeQuery = event => {
    setQuery(event.target.value.trim());
    applyQuery(event.target.value.trim());
    setTitle('No selected person');
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className={classNames('dropdown', { 'is-active': inputFocus })}>
          <div className="dropdown-trigger">
            <input
              value={query}
              onChange={handleChangeQuery}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setInputFocus(true)}
            />
          </div>
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredList.map(person => {
                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => {
                      setCheckedItem(person);
                      setInputFocus(false);
                      setQuery(person.name);
                      setTitle(
                        `${person.name} (${person.born} - ${person.died})`,
                      );
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {filteredList.length === 0 && query != '' && (
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
