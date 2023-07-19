import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

interface Props {
  people: Person[],
  onSelect: (personSlug:string) => void,
}

const noPeopleMessage = (
  <div className="dropdown-item">
    <p>
      No matching suggestions
    </p>
  </div>
);

export const DropdownList: React.FC<Props> = ({ people, onSelect }) => {
  const filteredPeopleCheck = people.length > 0;

  return (
    <div className="dropdown-content">
      <div className="dropdown-content">
        {people.map(person => (
          <DropdownItem
            key={person.slug}
            person={person}
            onSelect={onSelect}
          />
        ))}
        {!filteredPeopleCheck && noPeopleMessage}
      </div>
    </div>
  );
};
