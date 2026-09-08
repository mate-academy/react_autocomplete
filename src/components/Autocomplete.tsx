import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  delay: number;
  onSelect: (person: Person | null) => void;
  onNotFound: (isNotFound: boolean) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay,
  onSelect,
  onNotFound,
}) => {
  const [query, setQuery] = useState('');
  const [filteringQuery, setFilteringQuery] = useState('');
  const [inFocus, setInFocus] = useState(false);

  const filteredList = useMemo(() => {
    if (!filteringQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name
        .toLocaleLowerCase()
        .includes(filteringQuery.toLocaleLowerCase()),
    );
  }, [filteringQuery]);

  useEffect(() => {
    onNotFound(filteringQuery !== '' && filteredList.length === 0);
  }, [filteringQuery, filteredList, onNotFound]);

  const debounceQuery = useCallback(debounce(setFilteringQuery, delay), []);

  function handleInput(newValue: string) {
    onSelect(null);
    setQuery(newValue);

    const trimmed = newValue.trim();

    debounceQuery.cancel();

    if (!trimmed) {
      setFilteringQuery('');

      return;
    }

    debounceQuery(trimmed);
  }

  function handleMouseDown(selectedPerson: Person) {
    onSelect(selectedPerson);
    setQuery(selectedPerson.name);
    setFilteringQuery(selectedPerson.name);
  }

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => handleInput(event.target.value)}
            onFocus={() => setInFocus(true)}
            onBlur={() => setInFocus(false)}
          />
        </div>

        {inFocus && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredList.map(person => {
                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onMouseDown={() => handleMouseDown(person)}
                  >
                    <p
                      className={classNames({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
