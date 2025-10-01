import React from 'react';
import { Person } from '../types/Person';

type Props = {
  suggestion: Person;
  isSelected: boolean;
  onClick: () => void;
};

const DropdownItem: React.FC<Props> = ({ suggestion, isSelected, onClick }) => {
  const { name } = suggestion;

  return (
    <div className="dropdown-item" data-cy="suggestion-item" onClick={onClick}>
      <p className={isSelected ? 'has-text-danger' : 'has-text-link'}>{name}</p>
    </div>
  );
};

export default React.memo(DropdownItem);
