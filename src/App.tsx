import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDownMenu } from './components/dropdown_menu/dropdownMenu';
import { Person } from './types/Person';

function debounce(callback: (arg: string) => void, delay = 300) {
  let timerId = 0;

  return (args: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [peopleList] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredList = useMemo(() => {
    return peopleList.filter(item =>
      item.name.toLocaleLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, peopleList]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const initialTitle = 'No selected person';
  const [title, setTitle] = useState(initialTitle);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              id="autocomplete"
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => {
                setIsFocused(true);
              }}
              onChange={event => {
                handleQueryChange(event);
                setTitle(initialTitle);
              }}
            />
          </div>

          {filteredList.length > 0 && peopleList && isFocused && (
            <DropDownMenu
              list={filteredList}
              setTitle={setTitle}
              setFocused={setIsFocused}
              setQuery={setQuery}
            />
          )}
        </div>

        {filteredList.length === 0 && (
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
