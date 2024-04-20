import { DropDownProps } from '../../types/Dropdown';
import { Person } from '../../types/Person';

import { DropdownItem } from '../DropdownItem/DropdownItem';

export const Dropdown: React.FC<DropDownProps> = ({ data, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {data.map((item: Person) => (
          <DropdownItem key={item.name} item={item} onSelected={onSelected} />
        ))}
      </div>
    </div>
  );
};
