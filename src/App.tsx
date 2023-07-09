import React, {
  useState, ChangeEvent, MouseEvent, useMemo, useCallback,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { AutoComplete } from './components/Autocomplete';

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

  const isVisible = isContentShown && (appliedQuery.length > 0);

  return (
    <main className="section">
      <h1>{isVisible}</h1>
      {selectedUser ? (
        <h1 className="title">
          {`${selectedUser?.name} (${selectedUser?.born} = ${selectedUser?.died})`}
        </h1>
      ) : (
        <h1 className="title">No selected person</h1>
      )}

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
