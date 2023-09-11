import classnames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person,
  onSelectedPerson: (personSlug: Person) => void;
};

export const DropDownItem: React.FC<Props> = ({
  person,
  onSelectedPerson = () => {},
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="dropdown-item"
      onClick={() => onSelectedPerson(person)}
    >
      <p className={classnames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
      >
        {person.name}
      </p>
    </div>
  );
};
