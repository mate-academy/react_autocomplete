import { DropdownItem } from '../DropdownItem/DropdownItem';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  handleListClick: (arg: Person) => void;
};

export const DropdownList = ({ people, handleListClick }: Props) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <DropdownItem
            key={person.slug}
            person={person}
            handleListClick={handleListClick}
          />
        ))}
      </div>
    </div>
  );
};
