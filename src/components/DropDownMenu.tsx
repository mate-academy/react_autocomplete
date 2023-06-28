import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  persons: Person[]
  onSelected: (slug: string, name: string) => void
};

export const DropDownMenu: React.FC<Props> = ({
  persons,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {persons.length === 0
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
                  onClick={(event) => {
                    event.preventDefault();
                    onSelected(person.slug, person.name);
                  }}
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
