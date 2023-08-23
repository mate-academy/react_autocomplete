import classNames from 'classnames';
import { Person } from '../../types/Person';
import './PeopleList.scss';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
  appliedQuery: string;
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelect = () => { },
  appliedQuery,
}) => {
  return (
    <div
      className="dropdown-content"
    >
      {people.map(person => (
        <div
          className="dropdown-item"
          key={person.slug}
          role="button"
          tabIndex={0}
          onClick={() => {
            onSelect(person);
          }}
          onKeyDown={() => onSelect(person)}
        >
          <p
            className={classNames('name', {
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
          >
            {person.name}
          </p>
        </div>
      ))}
      {(people.length === 0 && appliedQuery) && (
        <p>No matching suggestions</p>
      )}
    </div>
  );
};
