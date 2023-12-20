import React from 'react';

interface Props {
  name: string;
}

export const DropdownItem: React.FC<Props> = ({ name }) => {
  return (
    <div className="dropdown-item">
      <p className="has-text-link">{name}</p>
    </div>
  );
};
