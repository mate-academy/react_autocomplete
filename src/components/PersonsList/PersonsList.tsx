import React, { memo } from 'react';
import PersonItem from '../PersonItem/PersonItem';
import { Person } from '../../types/Person';

type Props = {
  persons: Person[];
  handleUserSelect: (user: Person) => void;
};

const PersonsList: React.FC<Props> = ({
  persons,
  handleUserSelect,
}) => (
  <div
    style={{ width: '100%' }}
    className="dropdown-menu"
    role="menu"
  >
    <div className="dropdown-content">
      {persons.map((person: Person) => (
        <PersonItem
          key={person.slug}
          person={person}
          handleUserSelect={handleUserSelect}
        />
      ))}
    </div>
  </div>
);

export default memo(PersonsList);
