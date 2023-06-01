/* eslint-disable no-console */
import React, { useContext } from 'react';
import cn from 'classnames';
import PeopleContext from '../contexts/PeopleContext';

export const People = React.memo(() => {
  const {
    input,
    setInput,
    applyQueryWithDebounce,
    filteredPeople,
    handleClick,
  } = useContext(PeopleContext);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;

    applyQueryWithDebounce(userInput);

    setInput(userInput);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="search"
          placeholder="Enter a part of the name"
          className="input"
          value={input}
          onChange={handleInput}
        />
      </div>

      {input && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0
              && filteredPeople.map((person) => (
                <button
                  key={person.slug}
                  type="button"
                  className="dropdown-item person-input-item"
                  onClick={() => {
                    handleClick(
                      `${person.name} (${person.born} = ${person.died})`,
                    );
                  }}
                >
                  <p
                    className={cn('has-text-link', {
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </button>
              ))}

            {!filteredPeople.length && <p>No matching suggestions</p>}
          </div>
        </div>
      )}
    </div>
  );
});
