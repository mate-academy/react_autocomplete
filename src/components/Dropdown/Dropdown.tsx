import React from 'react';
import './Dropdown.scss';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

type Props = {
  people: Person[];
  query: string;
  debouncedQuery: string;
  onQueryChange: (newQuery: string) => void;
  onResetQuery: () => void;
  onPersonClick: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = (
  {
    people,
    query,
    debouncedQuery,
    onQueryChange,
    onResetQuery,
    onPersonClick,
  },
) => {
  return (
    <div className={
      cn(
        'dropdown',
        { 'is-active': !!debouncedQuery },
      )
    }
    >
      <div className="dropdown-trigger ">
        <div className="control has-icons-right ">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />

          {query && (
            <span className="icon is-right">
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={onResetQuery}
              />
            </span>
          )}
        </div>
      </div>

      <div
        className="dropdown-menu"
        role="menu"
      >
        <ul className="dropdown-content">
          {
            people.length > 0 ? (
              people.map((person) => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  onPersonClick={onPersonClick}
                />
              ))
            ) : (
              <li className="dropdown-item">
                No match found
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
};
