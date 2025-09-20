import { Person } from '../../types/Person';

interface Props {
  filteredPeople: Person[];
  onSelected: (person: Person) => void;
}

export const PersonList: React.FC<Props> = ({ filteredPeople, onSelected }) => (
  <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
    <div className="dropdown-content">
      {filteredPeople.map(person => (
        <div
          className="dropdown-item"
          key={person.name}
          data-cy="suggestion-item"
          onMouseDown={() => onSelected(person)}
          style={{ cursor: 'pointer' }}
        >
          <p className="has-text-link">{person.name}</p>
        </div>
      ))}
    </div>
  </div>
);
