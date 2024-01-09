import React, { useContext } from 'react';
import classNames from 'classnames';
import { AppContext } from '../AppContext';

export const People = React.memo(
  () => {
    const {
      personName,
      setPersonName,
      appliedQuery,
      filterPeople,
      handleClick,
    } = useContext(AppContext);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const trimmedValue = event.target.value;

      setPersonName(trimmedValue);
      appliedQuery(trimmedValue);
    };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={personName}
            onChange={handleInputChange}
          />
        </div>

        {personName && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filterPeople.length > 0 && (
                filterPeople.map(person => (
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

              {!filterPeople.length && (
                <p>No matching suggestions</p>
              )}
            </div>
          </div>
        )}

      </div>
    );
  },
);
