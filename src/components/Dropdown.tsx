import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,

};

export const Dropdown: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0 ? (
          people.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <tr
                className={cn('has-text-link', {
                  'has-text-danger': person.sex === 'f',
                })}
                onClick={() => onSelect(person)}
              >
                <td>{person.name}</td>
              </tr>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p className="has-text-danger">No matches</p>
          </div>
        )}
      </div>
    </div>
  );
};
