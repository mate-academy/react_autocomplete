import cn from 'classnames';
import { Person } from '../types/Person';

/*eslint-disable*/

type Props = {
  setState: React.Dispatch<React.SetStateAction<{
    isSelectedInput: boolean,
    isSelectedPerson: boolean,
    isSelectedPersonData: Person | null,
    query: string,
    appliedQuery: string,
  }>>,
  filterByPerson: Person[],
};

export const DropDown: React.FC<Props> = ({
  setState,
  filterByPerson,
}) => {
  return (
    <div className="dropdown-content">
      {filterByPerson.map(person => (
        <div className="dropdown-item" key={person.slug}>
          <p
            onClick={() => {
              setState((prevState) => ({
                ...prevState,
                isSelectedPerson: true,
                isSelectedPersonData: person,
                isSelectedInput: false,
              }));
            }}
            className={cn({
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
          >
            {person.name}
          </p>
        </div>
      ))}
    </div>
  );
};
