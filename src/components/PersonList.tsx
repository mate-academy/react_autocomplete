import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  persons: Person[],
  handleSelectedPerson: (event: React.MouseEvent, person: Person) => void,
};

export const PersonList: React.FC<Props> = React.memo(({
  persons,
  handleSelectedPerson,
}) => (
  <>
    {persons.map((person: Person) => (
      <div className="dropdown-item" key={person.name}>
        <a
          href="#/"
          className={classNames({
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
          onClick={event => handleSelectedPerson(event, person)}
        >
          {person.name}
        </a>
      </div>
    ))}
  </>
));
