import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
  debounceDelay?: number;
}

export const DropDown: React.FC<Props> = ({
  people,
  onSelected = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.slug}
            onClick={() => {
              onSelected(person);
            }}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
