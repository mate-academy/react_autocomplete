import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  filteredPeople: Person[];
  setSelectedPerson: (value: Person) => void;
  setQuery: (value: string) => void;
  setIsFocused: (value: boolean) => void;
};

export const Dropdown: React.FC<Props> = ({
  filteredPeople,
  setSelectedPerson,
  setQuery,
  setIsFocused,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">

        {filteredPeople.length !== 0
          ? (
            filteredPeople.map(person => (
              <a
                key={person.slug}
                href="/#"
                onMouseDown={() => {
                  setSelectedPerson(person);
                  setQuery(person.name);
                  setIsFocused(false);
                }}
                className="dropdown-item"
              >
                {person.name}
              </a>
            ))
          )
          : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
};
