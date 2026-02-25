import React, { useState, useMemo } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import classNames from 'classnames';

type Props = {
  timeout?: number;
  selectedPerson: Person | null;
  onSelected: React.Dispatch<React.SetStateAction<Person | null>>;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ timeout = 300, onSelected, selectedPerson }) => {
    const [showList, setShowList] = useState(false);
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');

    const filteredPeople = useMemo(() => {
      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      );
    }, [appliedQuery]);

    const applyQuery = useMemo(
      () => debounce((value: string) => setAppliedQuery(value.trim()), timeout),
      [],
    );

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);

      if (selectedPerson && event.target.value !== selectedPerson.name) {
        onSelected(null);
      }

      applyQuery(event.target.value);
    };

    return (
      <>
        <div className={classNames('dropdown', { 'is-active': showList })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              onChange={handleQueryChange}
              onFocus={() => setShowList(true)}
              onBlur={() => {
                setTimeout(() => setShowList(false), 200);
              }}
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          {showList && filteredPeople.length !== 0 && (
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
                    onMouseDown={() => {
                      onSelected(person);
                      setQuery(person.name);
                      setShowList(false);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showList && filteredPeople.length === 0 && (
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
  },
);

Autocomplete.displayName = 'Autocomplete';
