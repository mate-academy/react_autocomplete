import DropdownItem from './DropdownItem';
import { DropdownContentProps } from '../types/Person';

export default function DropdownContent({
  people,
  onSelectPerson,
}: DropdownContentProps) {
  return (
    <div className="dropdown-content">
      {people.map(person => (
        <DropdownItem
          key={person.slug}
          person={person}
          onSelectPerson={onSelectPerson}
        />
      ))}
    </div>
  );
}
