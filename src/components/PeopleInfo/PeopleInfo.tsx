import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person;
  onClick: (people: Person) => void;
};

export const PeopleInfo: React.FC<Props> = ({ people, onClick }) => (
  // eslint-disable-next-line
  <div
    className="dropdown-item"
    data-cy="suggestion-item"
    key={people.slug}
    onClick={() => onClick(people)}
  >
    <p className="has-text-link">{people.name}</p>
  </div>
);
