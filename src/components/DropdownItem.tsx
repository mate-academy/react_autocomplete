import { FC } from 'react';

type DropdownItemProps = {
  name: string;
  onSelected: (name: string) => void;
  onFocus: (value: boolean) => void;
};

export const DropdownItem: FC<DropdownItemProps> = ({
  name,
  onSelected,
  onFocus,
}) => {
  return (
    <div className="dropdown-content">
      <div className="dropdown-item " data-cy="suggestion-item">
        <p
          className="has-text-link "
          onClick={() => {
            onSelected(name);
            onFocus(false);
          }}
        >
          {name}
        </p>
      </div>
    </div>
  );
};
