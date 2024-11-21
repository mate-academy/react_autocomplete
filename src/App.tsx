import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const delay = 300;
  const applyQuery = useCallback(debounce(setQuery, delay), [delay]);
  const [isSelected, setSelected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [personInfo, setPersonInfo] = useState<Person | null>(null);
  const normalizeQuery = query.toLowerCase();
  const filteredList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalizeQuery),
    );
  }, [normalizeQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelected(false);
  };

  const handleFocus = () => {
    setSelected(false);
    setIsDropdownOpen(true);
  };

  const handleBlur = () => {
    setIsDropdownOpen(false);
  };

  const handleClickOnPerson = (person: Person) => {
    setQuery(person.name);
    setPersonInfo(person);
    setSelected(true);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {isSelected
            ? `${personInfo?.name} (${personInfo?.born} - ${personInfo?.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': isDropdownOpen })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              className="input"
              data-cy="search-input"
              onChange={event => handleQueryChange(event)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredList.length !== 0 ? (
                filteredList.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onMouseDown={() => handleClickOnPerson(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  );
                })
              ) : (
                <div
                  className="
                  notification is-danger is-light mt-3 is-align-self-flex-star
                  "
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

{
  /* <div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-link">Pieter Haverbeke</p>
</div>

<div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-link">Pieter Bernard Haverbeke</p>
</div>

<div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-link">Pieter Antone Haverbeke</p>
</div>

<div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-danger">Elisabeth Haverbeke</p>
</div>

<div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-link">Pieter de Decker</p>
</div>

<div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-danger">Petronella de Decker</p>
</div>

<div className="dropdown-item" data-cy="suggestion-item">
<p className="has-text-danger">Elisabeth Hercke</p>
</div> */
}
