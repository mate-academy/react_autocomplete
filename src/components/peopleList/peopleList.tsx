import { Person } from '../../types/Person';

type Props = {
  people: Person[]
  delay?: number
  onSelect: (person: Person) => void
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map((person) => (
          <button
            type="button"
            className="dropdown-item"
            key={person.name}
            onClick={() => {
              onSelect(person);
            }}
          >
            <p className={
              person.sex === 'm'
                ? 'has-text-link'
                : 'has-text-danger'
            }
            >
              {person.name}
            </p>
          </button>
        ))}

        {people.length === 0 && (
          <div className="dropdown-item">
            <p className="has-text-link">
              No matching suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
