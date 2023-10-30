import cn from 'classnames';
import { Person } from '../types/Person';
import './DropDown.scss';

type Props = {
  setState: React.Dispatch<React.SetStateAction<{
    isSelectedInput: boolean,
    isSelectedPerson: boolean,
    isSelectedPersonData: Person | null,
    query: string,
  }>>,

  filteredByPerson: Person[],
};

export const DropDown: React.FC<Props> = ({
  setState,
  filteredByPerson,
}) => {
  return (
    <div className="dropdown-content">
      {filteredByPerson.length ? (
        filteredByPerson.map(person => (
          <div
            role="button"
            tabIndex={0}
            key={person.slug}
            onMouseDown={() => {
              setState((prevState) => ({
                ...prevState,
                isSelectedPerson: true,
                isSelectedPersonData: person,
                isSelectedInput: false,
              }));
            }}
            className={cn('dropdown-item', {
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
          >
            <p>{person.name}</p>
          </div>
        ))
      ) : (
        <div className="dropdown-item has-text-danger">
          No matching suggestions
        </div>
      )}
    </div>
  );
};
