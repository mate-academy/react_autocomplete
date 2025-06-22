import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Notification } from './components/Notification';
import { Person } from './types/Person';
import { DropDownList } from './components/DropDownList';

export const App: React.FC = () => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const [list, setList] = useState(peopleFromServer);

  const NO_MATCH_MESSAGE = 'No matching suggestions';

  useEffect(() => {
    const filtered = [...peopleFromServer].filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );

    setList(() => filtered.sort((a, b) => a.name.localeCompare(b.name)));

    if (query.trim().length === 0) {
      setSelected(null);
    }
  }, [query]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
  };

  const handleSelection = useCallback((person: Person) => {
    setSelected(() => person);
    setQuery(person.name);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected &&
            `${selected?.name} (${selected?.born} - ${selected?.died})`}
          {!selected && `No selected person`}
        </h1>
        <div className={classNames('dropdown', { 'is-active': isFocused })}>
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleInput}
            />
          </div>
          {list.length !== 0 && (
            <DropDownList list={list} onSelected={handleSelection} />
          )}
        </div>
        {list.length === 0 && <Notification message={NO_MATCH_MESSAGE} />}
      </main>
    </div>
  );
};
