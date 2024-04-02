import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@fortawesome/fontawesome-free/css/all.css';
type Props = {
  onSelected: (value: Person | null) => void;
  selectedUser: Person | null;
};

export const Autocomplete: React.FC<Props> = ({ onSelected, selectedUser }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [query, setQuery] = useState('');

  const titleField = useRef<HTMLInputElement>(null);
  const setUser = (user: Person) => {
    onSelected(user);
    setQuery(user.name);
    setTimeout(() => {
      setIsOpened(false);
    }, 100);
  };

  useEffect(() => {
    //Use Ref for input
    if (titleField.current) {
      //Check if is Value input and Selected user for test, clear input
      if (!titleField.current.value && selectedUser) {
        onSelected(null);
      }
    }

    if (selectedUser && selectedUser.name !== query) {
      onSelected(null);
    }
  }, [titleField.current?.value, selectedUser, query, onSelected]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  // Filtering users
  const filteredUsers = useMemo(() => {
    return peopleFromServer.filter(user =>
      user.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  //Remove from state user and input query
  const handleRemove = () => {
    setQuery('');
    setAppliedQuery('');
    setIsOpened(false);
    onSelected(null);
  };

  //Open List on the click arrow and set Focus for input
  const handleOpen = () => {
    if (isOpened) {
      setIsOpened(false);
    } else {
      if (titleField.current) {
        titleField.current.focus();
      }

      setIsOpened(true);
    }
  };

  //Open List on the focus input
  const handleFocus = () => {
    if (!isOpened) {
      setIsOpened(true);
    }
  };

  //Close List on the blur input
  const handleBlur = () => {
    setTimeout(() => {
      if (isOpened) {
        setIsOpened(false);
      }
    }, 100);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isOpened,
        })}
      >
        <div className="dropdown-trigger">
          <input
            ref={titleField}
            id="title"
            type="text"
            placeholder="Enter a part of the name"
            className={classNames('input', {
              active: isOpened || selectedUser,
            })}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={query}
            data-cy="search-input"
          />
          <div className="options">
            {selectedUser && (
              <span className="icon is-small remove" onClick={handleRemove}>
                <i className="far fa-trash-alt" aria-hidden="true"></i>
              </span>
            )}
            <span
              className={classNames('icon is-small arrow', {
                transform: isOpened,
              })}
              onClick={handleOpen}
            >
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </div>
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredUsers.map(user => (
              <div
                key={user.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => setUser(user)}
              >
                <p className="has-text-link">{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 && (
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
    </>
  );
};
