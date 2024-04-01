import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPeople] = useState<Person | null>(null);
  const [openList, setOpenList] = useState(false);

  const [search, setSearch] = useState('');
  const [request, setRequest] = useState('');
  const delay = 300;

  const showPeople = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.toLowerCase().includes(request.toLowerCase().trim()),
    );
  }, [request]);

  const applySearch = useMemo(() => debounce(setRequest, delay), [setRequest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applySearch(e.target.value);
    setOpenList(true);
    setSelectedPeople(null);
  };

  const handleSelectedPeople = (people: Person) => {
    setSelectedPeople(people);
    setSearch(people.name);
    setOpenList(false);
  };

  const handleCancelValue = () => {
    setSearch('');
    setSelectedPeople(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson?.name
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': openList,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setOpenList(true)}
            />
            {search === selectedPerson?.name && (
              <button
                className="delete is-small"
                onClick={() => handleCancelValue()}
              ></button>
            )}
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {showPeople.map(people => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.name}
                  onClick={() => handleSelectedPeople(people)}
                >
                  <p
                    className={classNames('person', {
                      'has-text-link': people.sex === 'm',
                      'has-text-danger': people.sex === 'f',
                      'is-selected': people.name === selectedPerson?.name,
                    })}
                  >
                    {people.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showPeople.length === 0 && (
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
