import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { User } from '../User/User';
import { Props } from '.';
import { Person } from '../../types/Person';
import classNames from 'classnames';

export const Dropdown: React.FC<Props> = ({
  users,
  onSelect,
  debounceDelay = 300,
}) => {
  // eslint-disable-next-line no-console
  console.log('render Dropdown');
  const [focus, setFocus] = useState(false);
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');

  const timerId = useRef<number | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const trimmed = event.target.value.trim().toLowerCase();

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      if (trimmed === '') {
        setQuery('');
      } else {
        setQuery(trimmed);
      }
    }, debounceDelay);
    setRawQuery(event.target.value);
    onSelect(null);
  }

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  const onSelected = useCallback(
    (user: Person) => {
      onSelect(user);
      setRawQuery(user.name);
      setQuery(user.name.toLowerCase());
    },
    [onSelect],
  );

  const filteredUsers = useMemo(
    () => users.filter(user => user.name.toLowerCase().includes(query)),
    [query, users],
  );

  return (
    <div className={classNames('dropdown', { 'is-active': focus })}>
      <div className="dropdown-trigger">
        <input
          value={rawQuery}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredUsers.length > 0 ? (
          <div className="dropdown-content">
            {filteredUsers.map(user => (
              <User key={user.slug} user={user} onSelected={onSelected} />
            ))}
          </div>
        ) : (
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
      </div>
    </div>
  );
};
