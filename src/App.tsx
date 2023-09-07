import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
// import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    }, [],
  );

  const handleUserSelection = useCallback((person: Person) => {
    setSelectedUser(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsListVisible(false);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${selectedUser?.name} (${selectedUser?.born} = ${selectedUser?.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsListVisible(true)}

          />
        </div>

        {isListVisible && (
          <DropdownMenu
            people={filteredPeople}
            onSelected={handleUserSelection}
          />
        )}
      </div>
    </main>
  );
};
