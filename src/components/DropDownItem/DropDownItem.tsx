import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  option: Person;
  onSelect: (option: Person) => void;
};

export const DropDownItem: React.FC<Props> = ({ option, onSelect }) => {
  const handleClick = () => {
    onSelect(option); // Передаём выбранную опцию вверх
  };

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={handleClick}
    >
      <p className="has-text-link">{option.name}</p>
    </div>
  );
};
