import './PeopleList.scss';
import { Person } from '../types/Person';

type Props = {
  persons: Person[];
  onSelect: (person: Person | null) => void;
};

export const PeopleList: React.FC<Props> = ({ persons, onSelect }) => {
  const handlePersonClick
    = (event: React.MouseEvent<HTMLAnchorElement>, person: Person) => {
      event.preventDefault();
      onSelect(person);
    };

  return (
    <div className="dropdown-content">
      {persons.length === 0 ? (
        <div className="dropdown-item">
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      ) : (
        persons.map((person) => (
          <div
            key={person.slug}
            className="dropdown-item"
          >
            <a
              href="/"
              onClick={(e) => handlePersonClick(e, person)}
            >
              <p className="has-text-link">
                {person.name}
              </p>
            </a>
          </div>
        ))
      )}
    </div>
  );
};
