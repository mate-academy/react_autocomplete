import { DropdownItemProps } from '../types/Person';

export default function DropdownItem({
  person,
  onSelectPerson,
}: DropdownItemProps) {
  const personClass = `${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'} `;

  const handleMouseDown = () => {
    onSelectPerson(person);
  };

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={handleMouseDown}
    >
      <p className={personClass}>{person.name}</p>
    </div>
  );
}
