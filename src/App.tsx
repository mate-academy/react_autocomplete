import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
const DELAY = 300;

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [peopleASelected, setPeopleASelected] = useState<Person | null>(null);
  const [visibilitedPeople, setVisibilitedPeople] = useState(peopleFromServer);
  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const filtredPeople = (qu: string) => {
    setVisibilitedPeople(
      visibilitedPeople.filter(people =>
        people.name.toLowerCase().includes(qu.toLowerCase()),
      ),
    );
  };

  const debouncedFilter = useMemo(() => debounce(filtredPeople, DELAY), []);

  const stateValues = (quertUs: string) => {
    setQuery(quertUs);
    setPeopleASelected(null);
    debouncedFilter(quertUs);
  };

  const selected = (people: Person) => {
    setPeopleASelected(people);
    setQuery(people.name);
    setIsFocus(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {peopleASelected
            ? `${peopleASelected.name} (${peopleASelected.born} - ${peopleASelected.died})`
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
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={event => {
                stateValues(event.target.value);
              }}
            />
          </div>

          {isFocus && visibilitedPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {visibilitedPeople.map(people => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={people.slug}
                    >
                      <a onMouseDown={() => selected(people)}>
                        <p className="has-text-link">{people.name}</p>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {visibilitedPeople.length === 0 && (
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
