import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import { EventType } from '../types/EventType';

type Props = {
  onSelect: (user: Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ onSelect, delay }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [isShowDropdown, setIsShowDropdown] = useState(false);

  const queryTrimLowercase = (queryStr: string) =>
    queryStr.trim().toLocaleLowerCase();

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(queryTrimLowercase(filter)),
    );
  }, [filter]);

  const applyQuery = useCallback(
    debounce((value: string) => setFilter(value), delay),
    [setFilter, delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    onSelect(null);
    setQuery(value);
    applyQuery(value);
    setIsShowDropdown(true);
  };

  const handleSuggestionClick = (event: EventType, suggestion: Person) => {
    event.preventDefault();
    setQuery(suggestion.name);
    setIsShowDropdown(false);
    onSelect(suggestion);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query || filter) {
      setQuery('');
      setFilter(event.target.value);
      applyQuery('');
      setTimeout(() => {
        setIsShowDropdown(false);
      }, delay);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          data-cy="search-input"
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => !query && setIsShowDropdown(true)}
          onBlur={handleBlur}
        />
      </div>

      {isShowDropdown && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {!filteredPeople.length ? (
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
            ) : (
              filteredPeople.map(user => (
                <div
                  className="dropdown-item is-clickable"
                  data-cy="suggestion-item"
                  key={user.name}
                  role="button"
                  tabIndex={0}
                  onClick={event => handleSuggestionClick(event, user)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleSuggestionClick(event, user);
                    }
                  }}
                >
                  <p
                    className={cn('dropdown-item', {
                      'has-text-link': user.sex === 'm',
                      'has-text-danger': user.sex === 'f',
                    })}
                  >
                    {user.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
