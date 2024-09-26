import { DropdownItemProps } from '../../types/DropdownItem';

export const DropdownItem: React.FC<DropdownItemProps> = ({
  onSelected,
  item,
}) => {
  return (
    <div
      onClick={() => onSelected(item)}
      key={item.name}
      className="dropdown-item"
      data-cy="suggestion-item"
    >
      <p className="has-text-link">{item.name}</p>
    </div>
  );
};
