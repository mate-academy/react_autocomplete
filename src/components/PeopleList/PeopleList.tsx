import React from 'react';
import { Person } from '../../types/Person';
import { PeopleInfo } from '../PeopleInfo';

type Props = {
  people: Person[];
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person
  ) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelect }) => (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length === 0 ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          people.map((person) => (
            <PeopleInfo
              person={person}
              key={person.slug}
              onSelectPerson={onSelect}
            />
          ))
        )}
      </div>
    </div>
  ),
);
