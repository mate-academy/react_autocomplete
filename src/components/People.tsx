import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
};

export const PeopleList: React.FC<Props> = ({ people, onSelect }) => {
  const handlePersonClick
    = (event: React.MouseEvent<HTMLAnchorElement>, person: Person) => {
      event.preventDefault();
      onSelect(person);
    };

  return (
    <div className="dropdown-content">
      {people.length === 0 ? (
        <div
          className="
        notification
        is-danger
        is-light
        mt-3
        is-align-self-flex-start
      "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      ) : (
        people.map((person) => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
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
