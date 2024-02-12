import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person,
};

export const PersonInfo: React.FC<Props> = ({
  person,
}) => (
  <div className="dropdown-item">
    <p
      className={classNames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
    >
      {person.name}
    </p>
  </div>
);
