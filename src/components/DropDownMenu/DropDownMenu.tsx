import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  personList: Person[]
  selectPerson: (person: Person) => void;
};

export const DropDownMenu: React.FC<Props> = ({ personList, selectPerson }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {personList.length
          ? personList.map(person => (
            <a
              href="/"
              type="button"
              className="dropdown-item"
              onClick={() => {
                selectPerson(person);
              }}
              key={person.slug}
            >
              <p className={cn({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </p>
            </a>
          ))
          : (
            <div className="dropdown-item">
              <p>
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
