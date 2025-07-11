import { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import 'bulma/css/bulma.css';

type Props = {
  personList: Person[];
  debounceDelay?: number;
  onSelected?: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({
  personList,
  debounceDelay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => clearTimeout(timeout);
  }, [query, debounceDelay]);

  const filteredPeople = personList.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => {
            const value = event.target.value;

            setQuery(value);

            if (onSelected) {
              onSelected(null);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>

      {(query !== '' || isFocused) &&
        (filteredPeople.length > 0 ? (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setQuery(person.name);
                    if (onSelected) {
                      onSelected(person);
                    }
                  }}
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
        ) : (
          <div
            // eslint-disable-next-line max-len
            className="notification is-danger is-light mt-3 is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ))}
    </div>
  );
};
