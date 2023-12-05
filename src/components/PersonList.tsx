import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  visiblePeople: Person[],
  onSelected?: (person: Person) => void,
};

export const PersonList: React.FC<Props> = ({
  visiblePeople,
  onSelected = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        { visiblePeople.length !== 0
          ? (visiblePeople.map(people => (
            <div className="dropdown-item" key={people.slug}>
              <a
                href="//"
                onClick={(event) => {
                  event.preventDefault();
                  onSelected(people);
                }}
                className={classNames({
                  'has-text-link': people.sex === 'f',
                  'has-text-danger': people.sex === 'm',
                })}
              >
                {people.name}
              </a>
            </div>
          ))) : (
            <div className="dropdown-item">
              <p className="has-text-danger">No match suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
};
