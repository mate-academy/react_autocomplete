import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

interface Props {
  onSelect?: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  onSelect = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showList, setShowList] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
      setShowList(!!value); // Show the list only if the query is not empty
    }, delay),
    [setAppliedQuery]
  );

  const filteredLists = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    );
  }, [appliedQuery]);

  const onSelectedPerson = (person: Person) => {
    setQuery(person.name);
    onSelect(person);
    setShowList(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setShowList(false); // Hide the list immediately while typing
    applyQuery(value); // Apply the query with debounce
    onSelect(null);
  };

  const handleBlurChange = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.relatedTarget) {
      setShowList(false);
    }
  };

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
          onFocus={() => setShowList(!!query)}
          onBlur={handleBlurChange}
        />
      </div>

      {showList && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredLists.length !== 0 ? (
              filteredLists.map(person => (
                <button
                  className="dropdown-item button is-white"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => onSelectedPerson(person)}
                >
                  <p
                    className={classNames('has-text-link', 'is-clickable', {
                      'has-text-danger': person.sex === 'f',
                    })}
                    key={person.name}
                  >
                    {person.name}
                  </p>
                </button>
              ))
            ) : (
              <div
                className={classNames(
                  'notification',
                  'is-danger',
                  'is-light',
                  'mt-3',
                  'is-align-self-flex-start',
                )}
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
