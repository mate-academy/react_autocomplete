import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  filteredPeople: Person[],
  handlePersonChange: (person: Person) => void
}

export const DropdownContent: React.FC<Props> = React.memo(({ filteredPeople, handlePersonChange }) => {

  return (<div className="dropdown-content">
    {filteredPeople.length > 0 && filteredPeople.map(person => {
      return (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.name}
        >
          <p
            className={cn({
              'has-text-danger': person.sex === 'f',
              'has-text-link': person.sex === 'm',
            })}
            onClick={() => handlePersonChange(person)}
          >
            {person.name}
          </p>
        </div>
      );
    })}
  </div>)
})