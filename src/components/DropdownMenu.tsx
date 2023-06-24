import { FC } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  preparedPersons: Person[];
}

export const DropdownMenu:FC<Props> = ({ preparedPersons }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {preparedPersons.map(person => {
          const { name, sex } = person;
          const isMale = sex === 'm';

          return (
            <div className="dropdown-item">
              <p className={cn({
                'has-text-link': isMale,
                'has-text-danger': !isMale,
              })}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
