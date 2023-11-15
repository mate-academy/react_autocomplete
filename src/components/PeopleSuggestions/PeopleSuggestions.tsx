import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelected: (person: Person) => void
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div
        className="dropdown-content"
      >
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            aria-hidden="true"
            style={{ cursor: 'pointer' }}
            onMouseDown={() => onSelected(person)}
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
        ))}
      </div>
    </div>
  );
};
