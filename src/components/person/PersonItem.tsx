import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const PersonItem: React.FC<Props> = ({
  person,
  onSelect,
}) => (
  <button
    type="button"
    className="dropdown-item button"
    onClick={() => onSelect(person)}
  >
    <p className="has-text-link">
      {person.name}
    </p>
  </button>
);
