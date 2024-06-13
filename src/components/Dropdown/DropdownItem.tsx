import React from 'react';

type Props = {
  name: string;
};

export const DropdownItem: React.FC<Props> = ({ name }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item">
      <p className="has-text-link">{name}</p>
    </div>
  );
};
