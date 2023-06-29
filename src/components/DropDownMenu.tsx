import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  persons: Person[]
  onPersonSelect: (slug: string, name: string) => void
};

export const DropDownMenu: React.FC<Props> = ({
  persons,
  onPersonSelect,
}) => {
  const handleClickOnPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    slug: string,
    name: string,
  ) => {
    event.preventDefault();
    onPersonSelect(slug, name);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {!persons.length
          ? (
            <div className="dropdown-item">
              <p>
                No matching suggestions
              </p>
            </div>
          )
          : (
            persons.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
              >
                <a
                  href="/"
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={(event) => (
                    handleClickOnPerson(event, person.slug, person.name)
                  )}
                >
                  {person.name}
                </a>
              </div>
            ))
          )}

      </div>
    </div>
  );
};
