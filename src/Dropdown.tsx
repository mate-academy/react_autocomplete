import { Person } from './types/Person';

export const Dropdown: React.FC<{
  people: Person[];
  onSelected: (person: Person) => void;
}> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
          >
            <p
              onClick={() => onSelected(person)}
              className={
                person.fatherName && person.motherName
                  ? 'has-text-link'
                  : 'has-text-danger'
              }
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
