import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../data/people';
import type { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person | null) => void;
  delay?: number;
};

const people: Person[] = peopleFromServer;

export const DropDown: React.FC<Props> = React.memo(
  ({ onSelected = () => {}, delay = 300 }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [isActive, setIsActive] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dropDownTimer = useCallback(debounce(setIsActive, delay), [delay]);

    const filteredPeople = useMemo(() => {
      return people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }, [appliedQuery]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;

      setQuery(newQuery);
      applyQuery(newQuery);
      setIsActive(false);
      onSelected(null);
      dropDownTimer(true);
    };

    const handleOnSelect = (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setIsActive(false);
    };

    return (
      <>
        <div
          className={classNames('dropdown', {
            'is-active': isActive,
          })}
        >
          <div className="dropdown-trigger">
            <input
              value={query}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
            />
          </div>

          {filteredPeople.length > 0 ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  return (
                    <button
                      key={person.slug}
                      type="button"
                      tabIndex={0}
                      className="dropdown-item button is-white"
                      data-cy="suggestion-item"
                      onMouseDown={() => handleOnSelect(person)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleOnSelect(person);
                        }
                      }}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
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
        ) : null}
      </>
    );
  },
);
