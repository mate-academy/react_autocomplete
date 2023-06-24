import { FC, memo } from 'react';
import { Person } from '../types/Person';
import { PersonsSelect } from './PersonsSelect';

interface Props {
  preparedPersons: Person[];
}

export const DropdownMenu:FC<Props> = memo(({ preparedPersons }) => {
  const isAviablePersons = preparedPersons.length > 0;

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {isAviablePersons
          ? (
            <PersonsSelect persons={preparedPersons} />
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
});
