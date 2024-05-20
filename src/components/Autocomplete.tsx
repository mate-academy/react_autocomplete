import React, { useState, useMemo, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

interface Props {
  onSelect?: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  onSelect = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuary, setAppliedQuery] = useState('');
  const [showList, setShowList] = useState(false);

  const appliQuary = useCallback(debounce(setAppliedQuery, delay), [
    setAppliedQuery,
  ]);

  const filteredLists = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.toLowerCase().includes(appliedQuary.toLowerCase()),
    );
  }, [appliedQuary]);

  const onselectedPerson = (person: Person) => {
    setQuery(person?.name);
    onSelect(person);
    setShowList(false);
  };

  const handleQuaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    appliQuary(event.target.value);
    setShowList(true);
    onSelect(null);
  };

  return (
    <div className={cn('dropdown', { 'is-active': showList })}>
      <div className="dropdown-trigger">
        <input
          value={query}
          onChange={handleQuaryChange}
          onFocus={() => setShowList(true)}
          onBlur={event => {
            if (!event.relatedTarget) {
              setShowList(false);
            }
          }}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      {showList && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredLists.length !== 0 ? (
              filteredLists.map(peopel => (
                <button
                  type="button"
                  className="dropdown-item button is-white"
                  data-cy="suggestion-item"
                  onClick={() => onselectedPerson(peopel)}
                  key={peopel.name}
                >
                  <p
                    className={cn({
                      'has-text-link': peopel.sex === 'm',
                      'has-text-danger': peopel.sex === 'f',
                    })}
                    key={peopel.name}
                  >
                    {peopel.name}
                  </p>
                </button>
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
