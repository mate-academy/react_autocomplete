import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  onSelect: (peoples: Person | null) => void;
};

export const Dropdown: React.FC<Props> = React.memo(({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [show, setShow] = useState(false);

  const applyQuery = debounce(setAppliedQuery, 300);

  const heandleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelect(null);
    },
    [applyQuery, onSelect],
  );

  const heandleClick = (people: Person) => {
    onSelect(people);
    setQuery(people.name);
  };

  const heandleBlur = () => {
    setTimeout(() => setShow(false), 300);
  };

  const filterPeoples = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': show })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={heandleQueryChange}
          onFocus={() => setShow(true)}
          onBlur={heandleBlur}
          data-cy="search-input"
        />
      </div>

      {show && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filterPeoples.length ? (
              filterPeoples.map(people => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.slug}
                  onClick={() => heandleClick(people)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{people.name}</p>
                </div>
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
                style={{ cursor: 'pointer' }}
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
});
