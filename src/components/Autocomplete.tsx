import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

type AutocompleteProps = {
  onSelect: (person: Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  onSelect,
  delay,
}) => {
  const [isInputActive, setIsInputActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsInputActive(true);
    onSelect(null);
  };

  const handlePersonClick = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setIsInputActive(false);
  };

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter(post =>
      post.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isInputActive,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsInputActive(true)}
          onBlur={() => setIsInputActive(false)}
        />
      </div>

      {isInputActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPerson.length > 0 ? (
              filteredPerson.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => handlePersonClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
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
      )}
    </div>
  );
};
