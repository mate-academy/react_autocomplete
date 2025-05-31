import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [title, setTitle] = useState('No selected person');

  const newQuery = debounce((str: string) => {
    const filteredPeople = peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(str.toLowerCase()),
    );

    setPeople(filteredPeople);
  }, 300);

  function inputChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setInputValue(event.target.value);
    newQuery(event.target.value);
    setTitle('No selected person');
  }

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
              data-cy="search-input"
              value={inputValue}
              onChange={inputChangeHandler}
              onFocus={() => setIsFocused(true)}
            />
          </div>

          {isFocused && (
            <Autocomplete
              people={people}
              setInputValue={setInputValue}
              setIsFocused={setIsFocused}
              setTitle={setTitle}
            />
          )}
        </div>
      </main>
    </div>
  );
};
