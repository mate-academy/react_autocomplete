import { Person } from './types/Person';

type Props = {
  person: Person;
  onSelect: (name: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelect }: Props) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onSelect(person)}
    >
      <p className="has-text-link"> {person?.name} </p>
    </div>
  );
};
