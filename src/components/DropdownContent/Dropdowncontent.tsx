import React from 'react';
import { Person } from '../../types/Person';

type Prop = {
  peoples: Person[],
  onSelected: (people: Person) => void,
};

export const DropdownContent : React.FC<Prop> = React.memo(({
  peoples,
  onSelected,
}) => {
  return (
    <ul className="dropdown-content">
      {peoples.map(people => {
        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <li
            key={people.name}
            className="dropdown-item"
            onClick={() => onSelected(people)}
          >
            <p className="has-text-link">{people.name}</p>
          </li>
        );
      })}
    </ul>
  );
});
