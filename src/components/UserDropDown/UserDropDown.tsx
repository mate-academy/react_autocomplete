import { FC } from 'react';

import { UserList } from '../UserList';
import { SearchField } from '../SearchField';
import { Person } from '../../types/Person';

type TUserDropDownProps = {
  searchField: string;
  handleInputField: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserSelect: (selectedPerson: Person) => void;
  setHasFocusField: (value: boolean) => void;
  hasFocusField: boolean;
  users: Person[];
};

export const UserDropDown: FC<TUserDropDownProps> = ({
  searchField,
  handleInputField,
  setHasFocusField,
  hasFocusField,
  users,
  handleUserSelect,
}) => (
  <div className="dropdown is-active">
    <SearchField
      searchField={searchField}
      handleInputField={handleInputField}
      setHasFocusField={setHasFocusField}
    />

    {hasFocusField && (
      users.length ? (
        <UserList
          users={users}
          handleUserSelect={handleUserSelect}
        />
      )
        : (
          <span>No matching suggestions</span>
        ))}
  </div>
);
