import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  users: Person[];
  onSelect: (person: Person) => void
}

export const PeopleList: React.FC<Props> = ({ users, onSelect }) => {
  return (
    <div
      className="dropdown-menu"
      role="menu"
    >
      <div className="dropdown-content">
        {
          users.length
            ? (users.map(person => {
              const {
                name,
                slug,
                sex,
              } = person;

              return (
                <button
                  type="button"
                  className="dropdown-item"
                  key={slug}
                  onMouseDown={() => onSelect(person)}
                  onKeyDown={() => onSelect(person)}
                >
                  <a
                    href="/"
                    className={cn(
                      'has-text-link',
                      { 'has-text-danger': sex === 'f' },
                    )}
                  >
                    {name}
                  </a>
                </button>
              );
            })
            ) : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )
        }
      </div>
    </div>
  );
};
