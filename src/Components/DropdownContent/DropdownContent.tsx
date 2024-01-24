import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

type Props = {
  listOfPeople: Person[],
  setSelectedPerson: (person: Person) => void,
  setQuery: (param: string) => void,
  setAppliedQuery: (param: string) => void,
};

export const DropdownContent: React.FC<Props> = ({
  listOfPeople,
  setSelectedPerson,
  setQuery,
  setAppliedQuery,
}) => {
  return (
    <div className="dropdown-content">
      {listOfPeople.map(person => (
        <DropdownItem
          person={person}
          key={person.slug}
          setSelectedPerson={setSelectedPerson}
          setQuery={setQuery}
          setAppliedQuery={setAppliedQuery}
        />
      ))}
    </div>
  );
};
