import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';

type Props = {
  delay: number;
  onSelect: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ delay, onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = debounce(setAppliedQuery, delay);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  const isNoMatching = !filteredPeople.length && query;
  const isChoosing = isFocused && filteredPeople.length > 0;

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelect(null);
    },
    [applyQuery, onSelect],
  );

  const handleChoose = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
  };

  return (
    <React.Fragment>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={query}
            onChange={handleChangeInput}
          />
        </div>

        {isChoosing && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => handleChoose(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isNoMatching && (
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
    </React.Fragment>
  );
};
