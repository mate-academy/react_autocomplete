import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (user: Person | null) => void;
  selectedUser: Person | null;
};
function Autocomplete({
  people,
  delay = 300,
  onSelected,
  selectedUser,
}: Props) {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestedPeople, setSuggestedPeople] = useState([...people]);
  const prevText = useRef('');

  function handleInputChange(input: string) {
    if (selectedUser) {
      onSelected(null);
    }
    setSearchText(input);
  }

  function handleSelectUser(username: string) {
    const user = people.find(u => u.name === username) as Person;
    onSelected(user);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      if (prevText.current !== searchText) {
        if (searchText.trim()) {
          setSuggestedPeople(
            people.filter(user =>
              user.name.toLowerCase().includes(searchText.trim().toLowerCase()),
            ),
          );
        } else {
          setSuggestedPeople(people);
        }
        prevText.current = searchText;
      }
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, delay]);

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isFocused,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={searchText}
            onChange={e => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {isFocused && suggestedPeople.length > 0 && (
            <div className="dropdown-content">
              {suggestedPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                >
                  <p
                    className="has-text-link"
                    onMouseDown={() => handleSelectUser(person.name)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          )}
          {suggestedPeople.length === 0 && isFocused && (
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
    </>
  );
}

export default Autocomplete;
