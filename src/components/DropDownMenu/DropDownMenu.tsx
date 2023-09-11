import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const DropDownMenu: React.FC<Props> = React.memo(
  ({ people, onSelect }) => {
    return (
      <div
        className="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content">
          {people?.length
            ? (
              people.map((person) => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => onSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            )
            : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
              )
          }
        </div>
      </div>
    );
  });
