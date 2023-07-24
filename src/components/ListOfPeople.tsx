import cn from 'classnames';
import { Person } from '../types/Person';

interface Props{
  people: Person[];
  onSelected: (person: Person) => void;
}

export const ListOfPeople: React.FC<Props> = ({
  people, onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0 ? (
          people.map((person) => (
            <div
              className="dropdown-item"
              key={person.slug}
              onClick={() => onSelected(person)}
              onKeyDown={() => onSelected(person)}
              role="button"
              tabIndex={0}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p>No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
