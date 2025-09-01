import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  options: Person[];
  onSelect: (person: Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ options, onSelect, delay }) => {
  const [dropdownInFocus, setDropdownInFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = debounce(setAppliedQuery, delay);

  const filteredPeople = useMemo(() => {
    if (!appliedQuery || appliedQuery === '') {
      return options;
    } else {
      return options.filter(person => {
        return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
      });
    }
  }, [options, appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': dropdownInFocus })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setDropdownInFocus(true)}
          onBlur={() => setDropdownInFocus(false)}
          onChange={e => {
            setQuery(e.target.value);
            applyQuery(e.target.value);
            onSelect(null);
          }}
          value={query}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length === 0 ? (
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
            filteredPeople.map(person => (
              <button
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => {
                  setQuery(person.name);
                  onSelect(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
