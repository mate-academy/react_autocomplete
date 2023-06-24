import { FC, memo } from 'react';
import { PersonsSelect } from './PersonsSelect';
import { Person } from '../../types/Person';

interface Props {
  preparedPersons: Person[];
  onSelectPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  setSelectMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropdownMenu:FC<Props> = memo((
  { preparedPersons, onSelectPerson, setSelectMenuVisible },
) => {
  const isAviablePersons = preparedPersons.length > 0;

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {isAviablePersons
          ? (
            <PersonsSelect
              persons={preparedPersons}
              onSelectPerson={onSelectPerson}
              setSelectMenuVisible={setSelectMenuVisible}
            />
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
});
