import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '.././data/people';
import { Person } from '../types/Person';
import cn from 'classnames';
type Props = {
  delay: number;
  onSelected: (person: Person | null) => void;
};
export const Dropdown: React.FC<Props> = React.memo(({ delay, onSelected }) => {
  const [personVal, setPersonVal] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropDown] = useState(false);
  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonVal(e.target.value);
    applyQuery(e.target.value);
    onSelected(null);
  };

  const handleFocus = () => {
    setShowDropDown(true);
  };

  const choiceHandler = (item: Person) => {
    onSelected(item);
    setPersonVal(item.name);
  };

  const handleBlur = () => {
    setShowDropDown(false);
  };

  return (
    <>
      <div className={`${cn('dropdown', { 'is-active': showDropdown })} `}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={personVal}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleQueryChange}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>
        {filteredPeople.length ? (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(e => (
                <div
                  onMouseDown={() => choiceHandler(e)}
                  key={e.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p className="has-text-link">{e.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
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
        ''
      )}
    </>
  );
});
