import { memo } from 'react';
import { Person as PersonType } from '../../types/Person';
import { Person } from '../Person';

type Props = {
  people: PersonType[],
};

export const PersonList: React.FC<Props> = memo(({ people }) => (
  <div
    className="dropdown-menu"
    role="menu"
    data-cy="suggestions-list"
  >
    <div className="dropdown-content">
      {people.map(person => (
        <Person
          key={person.name}
          person={person}
        />
      ))}
    </div>
  </div>
));
