/* eslint-disable @typescript-eslint/indent */
import { useState, useMemo, useEffect } from 'react';
import { Person } from '../types/Person';
type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [query, setQuery] = useState('');
  const [onFocus, setOnFocus] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.includes(appliedQuery));
  }, [people, appliedQuery]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => clearTimeout(timerId);
  }, [query, delay]);

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            onSelected(null);
          }}
          onFocus={() => setOnFocus(true)}
        />
      </div>

      {onFocus && (
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
              data-cy="suggestion-item"
              onClick={() => {
                setQuery(person.name);
                setAppliedQuery(person.name);
                setOnFocus(false);
                onSelected(person);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      )}
      {onFocus && filteredPeople.length === 0 && (
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
  );
};
