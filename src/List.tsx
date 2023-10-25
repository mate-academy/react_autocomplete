import classNames from 'classnames';
import { Person } from './types/Person';

type Props = {
  visiblePeople: Person[];
  onSelectPerson?: (value: Person) => void;
};

export const List: React.FC<Props> = ({
  visiblePeople,
  onSelectPerson = () => {},
}) => (
  <div className="dropdown-menu" role="menu">
    {visiblePeople.length > 0 ? (
      <div
        className="dropdown-content"
      >
        {visiblePeople.map(person => (
          <button
            key={person.slug}
            type="button"
            onClick={() => {
              onSelectPerson(person);
            }}
            className={classNames({
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
          >
            {person.name}
          </button>
        ))}
      </div>
    ) : (
      'No matching suggestions'
    )}
  </div>
);
