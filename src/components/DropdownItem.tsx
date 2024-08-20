import { FC } from 'react';

type DropdownItemProps = {
  name: string;
};

export const DropdownItem: FC<DropdownItemProps> = ({ name }) => {
  return (
    <div className="dropdown-item " data-cy="suggestion-item">
      <p className="has-text-link ">{name}</p>
    </div>
  );
};
