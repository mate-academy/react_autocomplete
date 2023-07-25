import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onClick: (person: Person) => void,
};
export const List: React.FC<Props> = ({ people, onClick }) => {
  return (
    <div
      className="dropdown-menu"
      role="menu"
    >
      {people.length === 0 ? (
        <div className="dropdown-content">
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        </div>
      ) : (
        <div className="dropdown-content">
          {people.map(person => {
            return (
              <div
                className="dropdown-item"
                key={person.slug}
                tabIndex={0}
                onClick={() => onClick(person)}
                onKeyDown={() => onClick(person)}
                role="button"
              >
                <p className="has-text-danger">{person.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
