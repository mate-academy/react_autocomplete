import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person) => void;
};

export const People: React.FC<Props> = ({
  people,
  onSelected = () => { },
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length === 0 ? (
          <div className="dropdown-item">
            <p>
              No matching suggestions
            </p>
          </div>
        )
          : people.map(person => (
            // eslint-disable-next-line react/button-has-type
            <button
              className="dropdown-item"
              key={person.slug}
              onClick={() => onSelected(person)}
            >
              <p className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </p>
            </button>
          ))}

      </div>
    </div>
  );
};
