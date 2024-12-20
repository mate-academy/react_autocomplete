import { debounce } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

import './App.scss';
import { Autocomplete } from './components/Autocomplete';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    applyQuery(event.target.value);
    setSelectedUser(null);
  };

  const filteredUser = useMemo(() => {
    return peopleFromServer.filter(el =>
      el.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser
            ? `${selectedUser?.name} (${selectedUser?.born} - ${selectedUser?.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={value}
              onChange={handleInput}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>

          {focus && (
            <Autocomplete user={filteredUser} onSelected={setSelectedUser} />
          )}
        </div>

        {filteredUser.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
