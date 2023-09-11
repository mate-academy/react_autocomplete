import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';
import debounce from 'lodash.debounce';

import { peopleFromServer } from './data/people';

import { Person } from './types/Person';
import { DELAY_OF_FILTERING } from './helpers/vars';

import { SearchTitle } from './components/SearchTitle';
import { UserDropDown } from './components/UserDropDown';

import './App.scss';

const filterUsers = (
  users: Person[],
  query: string,
) => {
  let preparedUsers = [...users];

  if (query) {
    const queryToLower = query.toLowerCase().trim();

    preparedUsers = preparedUsers.filter(({ name }) => (
      name.toLowerCase().includes(queryToLower)
    ));
  }

  return preparedUsers;
};

export const App: React.FC = () => {
  const [searchField, setSearchField] = useState('');
  const [hasFocusField, setHasFocusField] = useState(true);
  const [appliedSearchField, setAppliedSearchField] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const preparedUsers = useMemo(() => {
    return filterUsers(peopleFromServer, appliedSearchField);
  }, [peopleFromServer, appliedSearchField]);

  const applieSearchField = useCallback(
    debounce(setAppliedSearchField, DELAY_OF_FILTERING),
    [],
  );

  const handleInputField = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchField(event.target.value);
    applieSearchField(event.target.value);
  }, []);

  const handleUserSelect = (selectedPerson: Person) => {
    const user = preparedUsers
      .find(({ slug }) => slug === selectedPerson.slug) ?? null;

    setSelectedUser(user);
    setSearchField('');
    applieSearchField('');
  };

  return (
    <main className="section">
      <SearchTitle
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <UserDropDown
        searchField={searchField}
        hasFocusField={hasFocusField}
        setHasFocusField={setHasFocusField}
        handleInputField={handleInputField}
        handleUserSelect={handleUserSelect}
        users={preparedUsers}
      />
    </main>
  );
};
