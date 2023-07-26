import React, {
  useState, ChangeEvent, MouseEvent, useMemo, useCallback,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { AutoComplete } from './components/Autocomplete';
import { UserInfo } from './components/UserInfo';

export const App: React.FC = () => {
  // #region state
  const [isContentShown, setIsContentShown] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  // #endregion
  // #region handlers

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsContentShown(false);
    setQuery(event.target.value.toLowerCase());
    applyQuery(event.target.value.toLowerCase());
  };

  const handleUserClick = (
    event: MouseEvent<HTMLAnchorElement>,
    value: Person,
  ) => {
    event.preventDefault();
    setIsContentShown(false);
    setSelectedUser(value);
  };
  // #endregion
  // #region functions

  const getFilteredUsers = () => {
    setIsContentShown(true);

    return peopleFromServer.filter(user => (
      user.name.toLowerCase().includes(appliedQuery)
    ));
  };
  // #endregion

  const filteredPeople = useMemo(
    getFilteredUsers, [appliedQuery, peopleFromServer],
  );

  const isVisible = isContentShown && appliedQuery.length > 0;

  return (
    <main className="section">
      <UserInfo user={selectedUser} />

      <AutoComplete
        users={filteredPeople}
        query={query}
        isContentShown={isVisible}
        onQueryChange={handleQueryChange}
        onUserClick={handleUserClick}
      />
    </main>
  );
};
