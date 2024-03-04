import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
};

export const List: React.FC<Props> = ({ people, onSelect = () => {} }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map((person: Person) => (
          <button
            style={{
              border: 0,
              cursor: 'pointer',
              backgroundColor: 'white',
            }}
            type="button"
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.name}
            onClick={() => onSelect(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
