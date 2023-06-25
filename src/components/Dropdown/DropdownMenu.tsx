import { memo, useContext } from 'react';
import { PersonsSelect } from './PersonsSelect';
import { DropdownDataContext } from './DropdownData';

export const DropdownMenu = memo((
) => {
  const dropDownData = useContext(DropdownDataContext);

  const isAviablePersons = dropDownData?.preparedPeople
  && dropDownData.preparedPeople.length > 0;

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {isAviablePersons
          ? (
            <PersonsSelect />
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
});
