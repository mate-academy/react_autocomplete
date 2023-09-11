import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

interface Props {
  onSelect: (person: Person) => void,
  query: string,
  isFocused: boolean,
  setIsFocused: (isFocused: boolean) => void,
  people?: Person[],
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void,
}

export const Dropdown: React.FC<Props> = ({
  people,
  onSelect,
  isFocused,
  onSearch,
  setIsFocused,
  query,
}) => {
  return (
    <div className={classnames('dropdown',
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
        {people?.length && query
          ? (
            <div className="dropdown-content">
              {people.map((person, index) => {
                const hasUnderline = index !== people.length - 1;

                return (
                  <DropdownItem
                    key={person.slug}
                    person={person}
                    onSelect={onSelect}
                    hasUnderline={hasUnderline}
                  />
                );
              })}
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
