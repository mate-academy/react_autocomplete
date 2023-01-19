import { FC, memo } from 'react';
import { DropDownItem } from './DropDownItem';
import type { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const DropDownMenu: FC<Props> = memo(({ people, onSelect }) => {
  return (
    <div
      className="dropdown-menu"
      role="menu"
    >
      <div className="dropdown-content">
        {people.length > 0 ? (
          people.map((person) => (
            <DropDownItem
              key={person.slug}
              onSelect={onSelect}
              person={person}
            />
          ))
        ) : (
          <p className="no-match">No matching suggestions</p>
        )}
      </div>
    </div>
  );
});
