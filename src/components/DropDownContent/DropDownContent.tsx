import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};
export const DropDownContent: React.FC<Props> = ({
  person,
  onSelect,
}) => (
  <button
    className="dropdown-item"
    type="button"
    key={person.slug}
    onClick={() => onSelect(person)}
    onKeyDown={() => onSelect(person)}
  >
    <p className="has-text-link">{person.name}</p>
  </button>
);
