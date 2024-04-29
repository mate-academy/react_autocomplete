import React, { useCallback, useMemo, useRef } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  delay?: number;
  onSelect: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect,
}) => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');

  const debouncedApplyQuery = useRef(
    debounce((value: string) => {
      setAppliedQuery(value);
      if (value !== '') {
        onSelect(null);
      }
    }, delay),
  );

  const applyQuery = useCallback(
    (value: string) => {
      debouncedApplyQuery.current(value);
    },
    [debouncedApplyQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleSelectPerson = (person: Person) => {
    onSelect(person);
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
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
              >
                <p className="has-text-link">{person.name}</p>
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
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
