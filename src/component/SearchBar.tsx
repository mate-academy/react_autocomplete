import React from 'react';
import { Person } from '../types/Person';

type Props = {
  filteredPeople: Person[];
};

export const SearchBar: React.FC<Props> = React.memo(({ filteredPeople }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {filteredPeople.map((person: Person) => {
          return (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <p
                className="has-text-link"
              >
                {person.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});
