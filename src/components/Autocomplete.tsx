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
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  const handleFocus = () => {
    setTouched(false);
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
    <div
      className={classNames('dropdown', {
        'is-active': !touched,
      })}
    >
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

        {filteredPersonList.length === 0 && (
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

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPersonList.map((person: Person) => {
            return (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('selecting');
                  onSelected(person);
                  setQuery(person.name);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
