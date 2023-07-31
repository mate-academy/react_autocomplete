import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const PeopleDropdown: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-content">
      {people.map(person => (
        <button
          type="button"
          style={{ cursor: 'pointer' }}
          className="dropdown-item"
          onClick={() => onSelect(person)}
        >
          <p className="has-text-link">{person.name}</p>
        </button>
      ))}

      {!!people && (
        <div className="dropdown-item">
          No matching suggestion
        </div>
      )}
    </div>
  );
};
