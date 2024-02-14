import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

type Props = {
  listOfPeople: Person[],
  handleItemClick: (person: Person) => void,
};

export const DropdownContent: React.FC<Props> = ({
  listOfPeople,
  handleItemClick,
}) => {
  return (
    <div className="dropdown-content">
      {listOfPeople.map(person => (
        <DropdownItem
          person={person}
          key={person.slug}
          handleItemClick={handleItemClick}
        />
      ))}
    </div>
  );
};
