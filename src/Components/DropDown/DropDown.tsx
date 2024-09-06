import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../../data/people';
import classNames from 'classnames';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const DropDown: React.FC<Props> = ({ onSelected, delay }) => {
  const [hasFocus, setHasFocus] = useState(false);
  const setHasFocusWithDelay = useMemo(
    () => debounce(setHasFocus, delay),
    [delay],
  );

  // #region query
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (newValue: string) => {
    setQuery(newValue);
    onSelected(null);
    applyQuery(newValue);
  };

  // #endregion

  const handlePersonSelect = (person: Person) => {
    handleQueryChange(person.name);
    setHasFocus(false);
    onSelected(person);
  };

  const filteredPeople: Person[] = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.includes(appliedQuery),
    );
  }, [appliedQuery]);

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': hasFocus })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => handleQueryChange(event.target.value)}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocusWithDelay(false)}
          />
        </div>

        {filteredPeople.length !== 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handlePersonSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredPeople.length === 0 && (
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
