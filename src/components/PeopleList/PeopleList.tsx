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
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
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
                </div>
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
