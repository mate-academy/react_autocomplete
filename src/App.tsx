import React, { useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropItems } from './dropdown_items/drop-items';
import { setAutocompleteList } from './helpers/helpers';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);

  const applyQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), 1000),
    [],
  );

  const autocompleteList = useMemo(() => {
    return setAutocompleteList(
      peopleFromServer,
      appliedQuery,
    );
  }, [appliedQuery]);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyQuery(e.target.value);
  };

  return (
    <main className="section">
      {selectedUser
        && (
          <h1 className="title">
            {`${selectedUser.name} (${selectedUser.born} = ${selectedUser.died})`}
          </h1>
        )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchQuery}
            onChange={handleQuery}
            onBlur={() => setHasFocus(false)}
            onFocus={() => setHasFocus(true)}
          />
        </div>

        {hasFocus
        && (
          <div className="dropdown-menu" role="menu">
            {autocompleteList.length > 0
              ? (
                <DropItems
                  users={autocompleteList}
                  onSelected={setSelectedUser}
                />
              )
              : (<p>No matching suggestions</p>)}
          </div>
        )}
      </div>
    </main>
  );
};
