import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function debounce<T extends (arg: string) => void>(callback: T, delay: number) {
  let timerId: number | undefined;

  return (arg: string) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      callback(arg);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [humanIndex, setHumanIndex] = useState<number>(0);
  const [appliedQuery, setAppliedQuery] = useState<string>('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const { name, born, died } = peopleFromServer[humanIndex];

  const filteredHumans = peopleFromServer.filter((human: Person) =>
    human.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const handleChangeQuery = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(false);
    setQuery(ev.target.value);
    applyQuery(ev.target.value);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {isSelected ? (
          <h1 className="title" data-cy="title">
            {`${name} (${born} - ${died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleChangeQuery}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {(query === '' ? peopleFromServer : filteredHumans).map(
                (el: Person) => (
                  <div
                    key={el.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => {
                      setIsSelected(true);
                      setHumanIndex(peopleFromServer.indexOf(el));
                    }}
                  >
                    <p className="has-text-link">{el.name}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {query !== '' && filteredHumans.length === 0 && (
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
