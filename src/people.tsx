import React, { useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from './AppContext';

export const People = React.memo(
  () => {
    const {
      personName,
      setPersonName,
      applyQuery,
      filteredPeople,
      handleClick,
    } = useContext(AppContext);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="search"
            placeholder="Enter a part of the name"
            className="input"
            value={personName}
            onChange={(event) => {
              setPersonName(event.target.value);
              applyQuery(event.target.value);
            }}
          />
        </div>

        {personName && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0 && (
                filteredPeople.map(person => (
                  <button
                    key={person.slug}
                    type="button"
                    className="dropdown-item button-custom"
                    onClick={() => {
                      handleClick(`${person.name} (${person.born} = ${person.died})`);
                    }}
                  >
                    <p
                      className={classNames('has-text-link', {
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </button>
                ))
              )}

              {!filteredPeople.length && (
                <p>No matching suggestions</p>
              )}
            </div>
          </div>
        )}

      </div>
    );
  },
);
