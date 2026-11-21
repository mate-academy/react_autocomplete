import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onQueryChange: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  onQueryChange,
}) => {
  const previousQuery = useRef('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onQueryChange();
    setIsFocused(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    previousQuery.current = person.name;
    onSelected(person);
    setIsFocused(false);
  };

  useEffect(() => {
    if (query === '') {
      previousQuery.current = query;
      setSuggestions(people);

      return;
    }

    const timer = setTimeout(() => {
      if (query === previousQuery.current) {
        return;
      }

      previousQuery.current = query;

      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filteredPeople);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay, people]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          className="input"
          data-cy="search-input"
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);

            const filteredPeople = people.filter(person =>
              person.name.toLowerCase().includes(query.toLowerCase()),
            );

            setSuggestions(filteredPeople);
          }}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={event => event.preventDefault()}
              onClick={() => handleSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}

          {query !== '' && suggestions.length === 0 && (
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
