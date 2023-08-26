import React from 'react';
import { Person } from '../../types/Person';
import { DropDownItem } from '../DropDownItem';

interface Props {
  filteredPersons: Person[];
  onSelect: (person: Person) => void;
}

export const DropDownMenu: React.FC<Props> = React.memo(({
  filteredPersons, onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {
          filteredPersons.length > 0 && filteredPersons.map(person => {
            return (
              <DropDownItem
                key={person.slug}
                person={person}
                onSelect={onSelect}
              />
            );
          })
        }

        {
          filteredPersons.length === 0 && (
            <div
              className="dropdown-item"
            >
              <p className="has-text">
                No matching suggestions
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
});
