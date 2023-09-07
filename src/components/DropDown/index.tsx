import cn from 'classnames';
import React, { ChangeEvent } from 'react';
import { Person } from '../../types/Person';

type Props = {
  onSelected: (person: Person) => void,
  query: string,
  isFocused: boolean,
  setIsFocused: (isFocused: boolean) => void,
  people: Person[] | undefined,
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void,
};

export const DropDown: React.FC<Props> = ({
  people,
  onSelected,
  isFocused,
  onSearch,
  setIsFocused,
  query,
}) => {
  return (
    <div className={cn('dropdown',
      { 'is-active': isFocused })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onClick={() => setIsFocused(!isFocused)}
          onChange={onSearch}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {people?.length
          ? (
            <div className="dropdown-content">
              {people.map((person, index) => (
                <React.Fragment key={person.slug}>
                  <button
                    type="button"
                    onClick={() => onSelected(person)}
                  >
                    <p className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    >
                      {person.name}
                    </p>
                  </button>
                  {index !== people.length - 1 && (
                    <hr className="dropdown-divider" />
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="dropdown-content">
              <p className="dropdown-item">
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
