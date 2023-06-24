/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useState,
  useMemo,
  useCallback,
  Dispatch,
} from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  delay: number;
  onSelected: (username: Person) => void;
};

const normalize = (value: string) => value.toLowerCase();

const debounce = (callback: Dispatch<string>, delay: number) => {
  let timerId: number;

  return (...args: string[]) => {
    clearTimeout(timerId);

    timerId = setTimeout(callback, delay, ...args);
  };
};

export const Autocomplete: React.FC<Props> = ({ delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [listIsShown, setListIsShown] = useState(false);

  const visibleUsers = useMemo(() => {
    return peopleFromServer.filter(user => {
      return normalize(user.name).includes(normalize(appliedQuery.trim()));
    });
  }, [appliedQuery]);

  const applyQueryAndShowList = (value: string) => {
    setAppliedQuery(value);
    setListIsShown(true);
  };

  const applyQuery = useCallback(
    debounce(applyQueryAndShowList, delay),
    [delay],
  );

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);

    if (value.trim() === '') {
      setListIsShown(false);
    } else {
      applyQuery(value);
      setListIsShown(true);
    }
  };

  const handleOnClick = (user: Person) => {
    onSelected(user);
    setQuery(user.name);
    setListIsShown(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleOnChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {listIsShown && (
          <div className="dropdown-content">
            {visibleUsers.length
              ? (visibleUsers.map(user => (
                <div
                  key={user.slug}
                  className="dropdown-item"
                >
                  <p
                    // role="button"
                    // tabIndex={0}
                    className="has-text-link"
                    onClick={() => handleOnClick(user)}
                  >
                    {user.name}
                  </p>
                </div>
              )))
              : 'No matching suggestions'}
          </div>
        )}
      </div>
    </div>
  );
};
