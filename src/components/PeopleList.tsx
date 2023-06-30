import React from 'react';
import { ListItem } from './ListItem';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onPersonNameClick: (event: React.MouseEvent, personSlug: string) => void;
}

export const PeopleList: React.FC <Props> = ({
  people,
  onPersonNameClick,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0
          ? (
            people.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
              >
                <ListItem
                  person={person}
                  onPersonNameClick={onPersonNameClick}
                />
              </div>
            ))) : 'No matching suggestions'}
      </div>
    </div>
  );
};
