import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

type Props = {
  people: Person[];
  onSelectedPerson: (person: Person) => void;
  onQuery: (value: string) => void;
};

export const DropdownMenu: React.FC<Props> = (
  {
    people,
    onSelectedPerson,
    onQuery,
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
              onQuery={onQuery}
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
