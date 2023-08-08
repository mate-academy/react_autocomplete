import React from 'react';

import { Person } from '../../types/Person';
import { PersonInfo } from '../Person/Person';

type Props = {
  people: Person[];
  onSelected: React.Dispatch<React.SetStateAction<string>>;
  isVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PeopleList:React.FC<Props> = React.memo(
  ({
    people,
    onSelected,
    isVisible
  }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.map(
            person => (
              <PersonInfo
                key={person.slug}
                person={person}
                onSelected={onSelected}
                isVisible={isVisible}
              />
            ),
          )}
        </div>
      </div>
    );
  },
);
