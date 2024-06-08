import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

import debounce from 'lodash.debounce';
import { useOnClickOutside } from 'usehooks-ts';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = memo(
  ({ onSelected = () => {}, delay = 300 }) => {
    // #region states and refs
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const input = useRef<HTMLInputElement>(null);
    const autocomplete = useRef<HTMLDivElement>(null);
    // #endregion

    // #region debounce callbacks
    const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);
    const applyShowSuggestions = useCallback(
      debounce(setShowSuggestions, delay),
      [],
    );
    // #endregion

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      applyQuery(e.target.value);

      setShowSuggestions(false);
      applyShowSuggestions(true);

      onSelected(null);
    };

    const handleFocus = () => {
      if (!appliedQuery) {
        setShowSuggestions(true);
      }
    };

    const filteredPeople = useMemo(() => {
      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }, [appliedQuery]);

    useOnClickOutside(autocomplete, () => {
      setShowSuggestions(false);
    });

    return (
      <div className="Autocomplete" ref={autocomplete}>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              ref={input}
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          {showSuggestions && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={() => {
                      onSelected(person);

                      setQuery(person.name);
                      setAppliedQuery(person.name);

                      input.current?.focus();
                      setShowSuggestions(false);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
      </div>
    );
  },
);
