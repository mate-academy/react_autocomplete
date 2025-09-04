import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PostList } from './components/PersonList';

function debounce(callback: Function, delay: number) {
  let timerId = 0;
  let lastValue = '';

  return (value: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      if (lastValue === value) {
        return;
      }

      lastValue = value;
      callback(value);
    }, delay);
  };
}

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
  };

  const filteredPeoples: Person[] =
    appliedQuery === '' && isFocused
      ? peopleFromServer
      : peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson && selectedPerson.name === query
            ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChangeQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <PostList
            filteredPeoples={filteredPeoples}
            selectedPerson={selectedPerson}
            onSelected={handleSelectPerson}
          />
        </div>

        {filteredPeoples.length === 0 && (
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
