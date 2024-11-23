import { Person } from '../../types/Person';
import './Autocomplete.scss';

interface Props {
  filteredPeople: Person[];
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  filteredPeople,
  onSelected,
}) => {
  return (
    <>
      {filteredPeople.map((person: Person) => (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.slug}
          onClick={() => onSelected(person)}
        >
          <p className="has-text-link">{person.name}</p>
        </div>
      ))}
    </>
  );
};
