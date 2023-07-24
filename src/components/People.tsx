import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { PeopleContext } from '../contexts/PeopleContexts';

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

  const [active, setActive] = useState('');

  return (
    <div className={classNames('dropdown', {
      'is-active': active,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={input}
          onChange={handleInput}
          onBlur={() => setActive('')}
          onClick={() => setActive('is-active')}
        />
      </div>

      {input && (
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0
              ? (filteredPeople.map((filteredPerson) => (
                <p
                  className={classNames('dropdown-item', {
                    'has-text-danger': filteredPerson.sex === 'f',
                    'has-text-link': filteredPerson.sex === 'm',
                  })}
                  role="presentation"
                  key={filteredPerson.slug}
                  onMouseDown={() => {
                    handleClick(filteredPerson);
                  }}
                >
                  {filteredPerson.name}
                </p>
              )))
              : <p className="dropdown-item">No matching suggestions</p>}
          </div>
        </div>
      )}
    </div>
  );
});
