import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  setSelectedPerson: (person: Person) => void,
  setQuery: (param: string) => void,
  setAppliedQuery: (param: string) => void,
};

export const DropdownItem: React.FC<Props> = ({
  person,
  setSelectedPerson,
  setQuery,
  setAppliedQuery,

}) => {
  const handlerOnClick = (p: Person) => {
    setSelectedPerson(p);
    setQuery(p.name);
    setAppliedQuery(p.name);
  };

  return (
    <div
      className="dropdown-item"
      role="button"
      onClick={() => handlerOnClick(person)}
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <p className={classNames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
      >
        {person.name}
      </p>
    </div>
  );
};
