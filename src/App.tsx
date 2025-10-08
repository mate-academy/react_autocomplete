import React, { useCallback, useEffect, useState } from 'react';
// import debounce = require('lodash.debounce');
import { DropTownContent } from './components/DropTownContent';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [filtredPeople, setFilteredPeople] = useState([...peopleFromServer]);
  const [menuVisability, setMenuVisability] = useState(false);


  const handleQuery = useCallback(
    debounce(value => {
      setFilteredPeople(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }, 300),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    handleQuery(value);
    setSelected(null);
  };

  useEffect(() => {
    if (selected) {
      setQuery(selected.name);
    }
  }, [selected]);

  const onSelect = person => {
    setSelected(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              onFocus={() => setMenuVisability(true)}
              onBlur={() => selected && setMenuVisability(false)}
              value={query}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={event => handleChange(event)}
            />
          </div>

          {menuVisability && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <DropTownContent
                onSelect={onSelect}
                people={filtredPeople}
              ></DropTownContent>
            </div>
          )}
        </div>
        {filtredPeople.length === 0 && (
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
