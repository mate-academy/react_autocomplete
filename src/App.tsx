import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import UserDropDown from './components/UserDropDown';
import { HeaderInfo } from './types/HeaderInfo';

//eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (callback: Function, delay: number) => {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => callback(...args), delay);
  };
};

export const App: React.FC = () => {
  const [header, setHeader] = useState<HeaderInfo | null>(null);
  const [users] = useState<Person[]>(peopleFromServer);
  const [username, setUsername] = useState('');
  const [showQuery, setShowQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const setName = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      if (showQuery !== e.target.value) {
        setShowQuery(e.target.value);
      }

      setFocused(true);
    }, 300),
    [],
  );

  const compareText = (user: Person, text: string) => {
    const userName = user.name.toLowerCase();

    if (userName.includes(text.toLowerCase())) {
      return true;
    }

    return false;
  };

  const getFormattedUsers = useCallback(() => {
    const formattedUsers = users.filter(us => compareText(us, showQuery));

    return formattedUsers;
  }, [users, showQuery]);

  const selectUser = (user: Person) => {
    setUsername(user.name);
    setFocused(false);
    setShowQuery('');
    setHeader({
      name: user.name,
      born: user.born,
      died: user.died,
    });
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {header
            ? `${header.name} (${header.born} - ${header.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={username}
              onChange={e => {
                setFocused(false);
                setName(e);
                setUsername(e.target.value);
                setHeader(null);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() =>
                setTimeout(() => {
                  setFocused(prev => {
                    if (prev) {
                      return false;
                    }

                    return prev;
                  });
                }, 100)
              }
            />
          </div>

          {focused && (
            <UserDropDown users={getFormattedUsers()} onSelected={selectUser} />
          )}
        </div>

        {getFormattedUsers().length === 0 && (
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
