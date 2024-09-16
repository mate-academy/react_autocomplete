import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showValues, setShowValues] = useState(false);

  const handleBlur = () => {
    setTimeout(() => {
      setShowValues(false);
    }, 100);
  };

  const handleFocus = () => {
    setShowValues(true);
  };

  const filteredPersonList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trimStart());
    applyQuery(event.target.value);

    if (appliedQuery !== selectedPerson?.name) {
      onSelected(null);
    }
  };

  return (
    <div className={classNames('dropdown is-active')}>
      <div className="dropdown-trigger">
        <input
          ref={titleField}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {showValues && (
          <div className="dropdown-content">
            {filteredPersonList.length ? (
              filteredPersonList.map((person: Person) => {
                return (
                  <div
                    style={{ cursor: 'pointer' }}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => {
                      onSelected(person);
                      setQuery(person.name);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                );
              })
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
        )}
      </div>
    </div>
  );
};
