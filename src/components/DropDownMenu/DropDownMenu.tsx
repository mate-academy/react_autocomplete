import React from 'react';
import { Person } from '../../types/Person';
import { DropDownContent } from '../DropDownContent/DropDownContent';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const DropDownMenu: React.FC<Props> = (
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
                /* eslint-disable*/
                <DropDownContent
                  key={person.slug}
                  onSelect={onSelect}
                  person={person}
                 />
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
