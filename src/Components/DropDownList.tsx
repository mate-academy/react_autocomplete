import cn from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[]
  onClick: (event: React.MouseEvent, person: Person) => void
}

export const DropDownList: React.FC<Props> = ({ people, onClick }) => (
  <div className="dropdown-content">
    {people.length > 0 ? (
      people.map(person => (
        <div
          className="dropdown-item"
          onClick={event => onClick(event, person)}
        >
          <p className={cn({
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
          style={{ cursor: 'pointer' }}
          >
            {person.name}
          </p>
        </div>
      ))
    ) : (
      <div className="dropdown-item">
        <p>No matching suggestions</p>
      </div>
    )}

  </div>
);
