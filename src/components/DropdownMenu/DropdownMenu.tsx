import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

interface Props {
  people: Person[];
}

export const DropDownMenu: React.FC<Props> = ({ people }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map((person, index) => (
          <DropdownItem person={person} key={index + 1} />
        ))}
      </div>
    </div>
  );
};
