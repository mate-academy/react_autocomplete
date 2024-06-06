import classNames from 'classnames';
import { Person } from '../types/Person';
import React from 'react';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  onSelect: (person: Person) => void;
};

export const People: React.FC<Props> = React.memo(
  ({ people, selectedPerson, onSelect }) => {
    return (
      <div className="dropdown-content">
        {people.map(person => {
          const { name } = person;

          return (
            <div className="dropdown-item" data-cy="suggestion-item" key={name}>
              <a
                className={classNames('has-text-link link', {
                  'has-text-danger': selectedPerson === person,
                })}
                onClick={() => onSelect(person)}
              >
                {name}
              </a>
            </div>
          );
        })}
      </div>
    );
  },
);
