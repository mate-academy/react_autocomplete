import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  isDropdownActive: boolean;
  value: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hideDropdown: () => void;
  people: Person[];
  onSelected: (person: Person) => void;
  onFocus: () => void;
}

export const Dropdown: React.FC<Props> = ({
  isDropdownActive,
  value,
  onInputChange,
  hideDropdown,
  people,
  onSelected,
  onFocus,
}) => (
  <div className={classNames('dropdown', {
    'is-active': isDropdownActive,
  })}
  >
    <div className="dropdown-trigger">
      <input
        type="text"
        value={value}
        placeholder="Enter a part of the name"
        className="input"
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={hideDropdown}
      />
    </div>

    {isDropdownActive && (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.length === 0 ? 'No matching suggestions' : (
            people.map(person => (
              <div
                key={people.indexOf(person)}
                className="dropdown-item"
                onClick={() => onSelected(person)}
                role="button"
                tabIndex={0}
                onKeyDown={() => { }}
              >
                <p className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                >
                  {person.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
);
