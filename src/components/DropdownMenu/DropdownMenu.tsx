import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

type Props = {
  people: Person[];
  onSelectedPerson: (person: Person) => void;
  onQuerry: (value: string) => void;
};

export const DropdownMenu: React.FC<Props> = (
  {
    people,
    onSelectedPerson,
    onQuerry,
  },
) => {
  return (
    <div
      className="dropdown-menu"
      role="menu"
    >
      <div className="dropdown-content">
        {people.length
          ? people.map((person) => (
            <DropdownItem
              key={person.slug}
              person={person}
              onSelectedPerson={onSelectedPerson}
              onQuerry={onQuerry}
            />
          ))
          : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
};
