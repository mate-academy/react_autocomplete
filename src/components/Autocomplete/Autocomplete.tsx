import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, onSelect = () => {} }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map((person, index) => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={index}
              onMouseDown={() => onSelect(person)}
            >
              <p
                className={cn('has-text-link', {
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
