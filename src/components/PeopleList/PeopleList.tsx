import React from 'react';
import { Person } from '../../types/Person';
import { PeopleInfo } from '../PeopleInfo';

interface Props {
  people: Person[],
  onPersonSelected: (selectedPerson: Person) => void,
}

export const PeopleList: React.FC<Props> = ({ people, onPersonSelected }) => {
  return (
    <div className="dropdown-menu is-active" role="menu">
      <div className="dropdown-content">
        {people.length
          ? (people.map(person => (
            <PeopleInfo
              onPersonSelected={onPersonSelected}
              person={person}
              key={person.slug}
            />
          )))
          : (
            <div className="dropdown-item">
              <p className="has-text-link">
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
