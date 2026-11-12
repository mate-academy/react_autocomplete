import React, { useEffect, useState } from "react";
import { Person } from "./types/Person";

type Props = {
  people: Person[],
  delay?: number,
  onSelected: (person: Person | null) => void,
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debounce, setDebounce] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(query.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const filteredPeople = people.filter(person => person.name.toLowerCase().includes(debounce.toLowerCase()));

  return (
    <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          placeholder="Enter a part of the name"
          className="input"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          data-cy='search-input'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            onSelected(null)
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content" data-cy="suggestions-list">
          {filteredPeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item" data-cy="suggestion-item"
              onClick={() => {
                setQuery(person.name);
                setIsOpen(false);
                onSelected(person);
              }}>
              <p className={person.sex === 'f' ? `has-text-danger` : "has-text-link"}>
                {person.name}
              </p>
            </div>
          ))}

          {!filteredPeople.length && (
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