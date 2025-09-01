import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropdownInFocus, setDropdownInFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = debounce(setAppliedQuery, 300);

  const filteredPeople = useMemo(() => {
    if (!appliedQuery || appliedQuery === '') {
      return peopleFromServer;
    } else {
      return peopleFromServer.filter(person => {
        return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
      });
    }
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': dropdownInFocus })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setDropdownInFocus(true)}
              onBlur={() => setDropdownInFocus(false)}
              onChange={e => {
                setQuery(e.target.value);
                applyQuery(e.target.value);
                setSelectedPerson(null);
              }}
              value={query}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length === 0 ? (
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
              ) : (
                filteredPeople.map(person => (
                  <button
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => {
                      setQuery(person.name);
                      setSelectedPerson(person);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </button>
                ))
              )}
              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-link">Pieter Haverbeke</p>*/}
              {/*</div>*/}

              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-link">Pieter Bernard Haverbeke</p>*/}
              {/*</div>*/}

              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-link">Pieter Antone Haverbeke</p>*/}
              {/*</div>*/}

              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-danger">Elisabeth Haverbeke</p>*/}
              {/*</div>*/}

              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-link">Pieter de Decker</p>*/}
              {/*</div>*/}

              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-danger">Petronella de Decker</p>*/}
              {/*</div>*/}

              {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
              {/*  <p className="has-text-danger">Elisabeth Hercke</p>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        {/*<div*/}
        {/*  className="*/}
        {/*    notification*/}
        {/*    is-danger*/}
        {/*    is-light*/}
        {/*    mt-3*/}
        {/*    is-align-self-flex-start*/}
        {/*  "*/}
        {/*  role="alert"*/}
        {/*  data-cy="no-suggestions-message"*/}
        {/*>*/}
        {/*  <p className="has-text-danger">No matching suggestions</p>*/}
        {/*</div>*/}
      </main>
    </div>
  );
};
