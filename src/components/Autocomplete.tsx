import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';
import cn from 'classnames';

type Props = {
  onSelected?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  onSelected = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListVisible, setList] = useState<boolean>(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name
        .toLocaleLowerCase()
        .trim()
        .includes(appliedQuery.toLocaleLowerCase().trim()),
    );
  }, [appliedQuery]);

  const selectedPerson = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setList(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setList(true);
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
          onFocus={() => setList(true)}
        />
      </div>

      {isListVisible && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredList.length !== 0 ? (
              filteredList.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => selectedPerson(person)}
                >
                  <p
                    className={cn('has-text-link', 'is-clickable', {
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div
                className={cn(
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
