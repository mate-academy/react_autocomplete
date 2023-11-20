import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  person: Person;
  onSelectItem: (person: Person) => void;
  isSelected: boolean;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  onSelectItem,
  isSelected,
}) => {
  const handleItemClick = () => {
    onSelectItem(person);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={cn('dropdown-item', { 'is-active': isSelected })}
      onClick={handleItemClick}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
