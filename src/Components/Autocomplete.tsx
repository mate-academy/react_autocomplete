import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  listOfPeople: Person[],
  onChange: (value: string) => void,
  value: string,
  onDelayApply: (value: string) => void,
  onSelect: (value: string) => void,
  query: string,
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    listOfPeople,
    onChange,
    value,
    onDelayApply,
    onSelect,
    query,
  }) => {
    const handleInput = (event: { target: { value: string; }; }) => {
      onChange(event.target.value);
      onDelayApply(event.target.value);
    };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleInput}
            value={value}
          />
        </div>

        {query && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {listOfPeople.map(person => (
                <div role="article">
                  <button
                    type="button"
                    onClick={() => onSelect(`${person.name} (${person.born} = ${person.died})`)}
                    onKeyDown={() => onSelect(`${person.name}`)}
                    tabIndex={0}
                    key={person.slug}
                  >
                    <div key={person.slug} className="dropdown-item">
                      <p
                        className={classNames('has-text-link', {
                          'has-text-danger': person.sex === 'f',
                        })}
                      >
                        {person.name}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
              {!listOfPeople.length && (
                <p>No matching suggestions</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
