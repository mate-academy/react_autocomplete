import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[]
  delay: number,
  onSelect?: (person: Person) => void,
}

export const Menu: React.FC<Props> = ({
  people,
  delay,
  onSelect = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">

        {peopleFromServer.map(person => (
          <div className="dropdown-item">
            <p className={cn({
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
