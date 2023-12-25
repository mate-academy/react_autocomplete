import React, { useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  query: string;
  queryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedPerson: (human: Person) => void;
  resetField: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  query,
  setSelectedPerson,
  queryChange,
  resetField,
}) => {
  // console.log('render Autocomplete');

  const [focused, setFocused] = useState(false);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={queryChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            resetField();
          }}
        />
      </div>

      {focused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length ? (
              people.map(person => (
                <div
                  role="menu"
                  tabIndex={0}
                  key={person.slug}
                  className="dropdown-item"
                  onMouseDown={() => {
                    setSelectedPerson(person);
                    resetField();
                  }}
                >
                  <p className={cn('has-text-link', {
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">
                  No matching suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
