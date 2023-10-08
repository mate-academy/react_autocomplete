import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import debounce from 'lodash.debounce';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import { PeopleList } from './components/PeopleList';

import './App.scss';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleSelectedUsers = (user: Person) => {
    setSelectedUser(user);
    setQuery(user.name);
    setIsVisible(false);
  };

  const filterUsers = useMemo(() => {
    return peopleFromServer.filter(
      user => user.name.toLocaleLowerCase().includes(
        appliedQuery.toLocaleLowerCase(),
      ),
    );
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value) {
      setIsVisible(true);
    }
  };

  const personField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (personField.current) {
      if (!selectedUser) {
        personField.current.focus();
      }
    }
  }, [selectedUser]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? <p>{`${selectedUser.name} ${selectedUser.born} - ${selectedUser.died}`}</p>
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQuery}
            onBlur={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
          />
        </div>

        <PeopleList
          users={filterUsers}
          onSelect={handleSelectedUsers}
          isVisible={isVisible}
        />
      </div>
    </main>
  );
};
