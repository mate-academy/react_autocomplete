import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onClick: (person: Person) => void;
};

export const PeopleInfo: React.FC<Props> = ({ person, onClick }) => (
  // eslint-disable-next-line
  <div
    className="dropdown-item"
    data-cy="suggestion-item"
    key={person.slug}
    onClick={() => onClick(person)}
  >
    <p className="has-text-link">{person.name}</p>
  </div>
);
