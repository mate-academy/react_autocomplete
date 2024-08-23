import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../../data/people';

import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem/DropdownItem';

type Props = {
  onSelect?: (person: Person | null) => void;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  onSelect = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [inputFocus, setInputFocus] = useState(true);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelect(null);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [appliedQuery, query]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setInputFocus(false)}
          onBlur={() => setInputFocus(true)}
        />
      </div>

      <div
        role="menu"
        data-cy="suggestions-list"
        className="dropdown-menu"
        id="dropdown-menu"
      >
        <div
          className={classNames('dropdown-content', {
            'is-hidden': filteredPeople.length === 0 || inputFocus,
          })}
        >
          {filteredPeople.map(person => (
            <DropdownItem
              person={person}
              onSelect={onSelect}
              key={person.slug}
            />
          ))}
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
      </div>
    </div>
  );
};
