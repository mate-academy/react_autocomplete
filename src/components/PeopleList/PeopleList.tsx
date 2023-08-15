import React from 'react';
import { Person } from '../../types/Person';
import { PeopleInfo } from '../PersonInfo';

type Props = {
  people: Person[];
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => void;
};

export const PeopleList: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length === 0 ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          people.map(person => (
            <PeopleInfo person={person} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
};
