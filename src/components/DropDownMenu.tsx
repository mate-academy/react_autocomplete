import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelected: (person: Person) => void,
};

export const DropDownMenu: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0
          ? people.map(person => (
            <button
              type="button"
              className="dropdown-item"
              key={person.slug}
              onClick={() => onSelected(person)}
            >
              <p
                className={classNames({
                  'has-text-danger': person.sex === 'f',
                  'has-text-link': person.sex === 'm',
                })}
              >
                {person.name}
              </p>
            </button>
          )) : (
            <div className="dropdown-item">
              <p className="has-text">
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
