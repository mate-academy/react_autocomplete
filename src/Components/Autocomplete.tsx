import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  list: Person[],
  onChange: (value: string) => void,
  value: string,
  onDelayApply: (value: string) => void,
  onSelect: (value: string) => void,
  query: string,
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    list,
    onChange,
    value,
    onDelayApply,
    onSelect,
    query,
  }) => {
    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={(event) => {
              onChange(event.target.value);
              onDelayApply(event.target.value);
            }}
            value={value}
          />
        </div>

        {query && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {list.map(person => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  onClick={() => onSelect(`${person.name} (${person.born} = ${person.died})`)}
                  onKeyDown={() => onSelect(`${person.name}`)}
                  role="button"
                  tabIndex={0}
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
                </a>
              ))}
              {!list.length && (
                <p>No matching suggestions</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
