import { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  people,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [listIsShown, setListIsShown] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const prevAppliedQuery = useRef('');
  const container = useRef<HTMLDivElement>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
  };

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      if (query !== prevAppliedQuery.current) {
        setAppliedQuery(query);
      }

      prevAppliedQuery.current = query;
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [query, delay]);

  const filterPeople: Person[] = useMemo(() => {
    if (appliedQuery === ' ') {
      return [];
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  return (
    <div
      className={listIsShown ? 'dropdown is-active' : 'dropdown'}
      ref={container}
      onBlur={() => setListIsShown(false)}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setListIsShown(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {listIsShown &&
            filterPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => {
                  setQuery(person.name);
                  onSelected(person);
                  setListIsShown(false);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          {filterPeople.length === 0 && listIsShown && (
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
