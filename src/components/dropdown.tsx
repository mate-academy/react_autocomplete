import classNames from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
};

export const Dropdown: React.FC<Props> = React.memo(({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" id="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map((person) => (
          <button
            type="button"
            className="dropdown-item"
            onClick={() => onSelect(person)}
          >
            <p
              className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
            >
              {person.name}
            </p>
          </button>
        ))}

        {people.length === 0 && (
          <p className="dropdown-item">
            No matching suggestion
          </p>
        )}
      </div>
    </div>
  );
});
