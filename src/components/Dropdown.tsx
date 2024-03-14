import React, { useRef, useState } from 'react';
import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown = React.memo(({ onSelected, delay = 300 }: Props) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const people = peopleFromServer;

  const delayedFilteredPeople = useRef(
    debounce((targetValue: string) => {
      const filtered = people.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(targetValue.toLocaleLowerCase().trim()),
      );

      setFilteredPeople(filtered);
    }, delay),
  ).current;

  const handleInputFocus = () => {
    debounce(() => setIsDropdownActive(true), delay)();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    delayedFilteredPeople(e.target.value);
    onSelected(null);
  };

  const handleClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownActive(false);
    delayedFilteredPeople('');
  };

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isDropdownActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        {filteredPeople.length ? (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  role="menuitem"
                  className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  data-cy="suggestion-item"
                  tabIndex={0}
                  onClick={() => handleClick(person)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleClick(person);
                    }
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {!filteredPeople.length && (
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
});
