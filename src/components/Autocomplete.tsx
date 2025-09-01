import classNames from 'classnames';
import React from 'react';

export const Autocomplete: React.FC = () => {
  return (
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
  )
}
