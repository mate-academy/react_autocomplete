import classNames from 'classnames';
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
    <div className={classNames('dropdown-item')} data-cy="suggestion-item">
      <p
        className="has-text-link"
        onClick={() => {
          onSelected(name);
          onFocus(false);
        }}
        onMouseDown={e => {
          e.preventDefault();
        }}
      >
        {name}
      </p>
    </div>
  );
};
