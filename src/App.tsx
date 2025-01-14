import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
//function debounce(callback:Function, delay:number) {
//let timerId = 0;

//return (...args:any) => {
//window.clearTimeout(timerId);
//timerId = window.setTimeout(() => {callback(...args);}, delay);
//};
//}

export const App: React.FC = () => {
  //const { name, born, died } = peopleFromServer[0];
  const [value, setValue] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  //const timerId = useRef(0);
  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedUser(null);
    setValue(event.target.value);
    applyQuery(event.target.value);
    //window.clearTimeout(timerId.current);
    //timerId.current=window.setTimeout(() => {setAppliedQuery(event.target.value); }, 1000);
  }

  const filteredUser = useMemo(() => {
    return peopleFromServer.filter(el =>
      el.name.toLowerCase().trim().includes(appliedQuery.toLowerCase().trim()),
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

          {focus && filteredUser && (
            <Autocomplete
              user={filteredUser}
              onSelected={setSelectedUser}
              setValue={setValue}
              setAppliedQuery={setAppliedQuery}
            />
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
