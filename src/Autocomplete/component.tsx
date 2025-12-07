import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
// import { el } from '@faker-js/faker';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
  selectedPerson: Person | null;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
  selectedPerson,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [refreshingQuery, setRefreshingQuery] = useState<string>('');

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    window.clearTimeout(timerId.current);
    if (selectedPerson) {
      if (event.target.value !== selectedPerson.name) {
        onSelected(null);
      }
    }

    timerId.current = window.setTimeout(() => {
      const trimmed = event.target.value.trim();

      if (trimmed !== '') {
        setRefreshingQuery(trimmed);
      }
    }, delay);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(timerId.current);
    };
  }, []);

  const handlePersonClick = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setRefreshingQuery(person.name);
    setIsOpen(false);
  };

  //const filteredPeople = useMemo(() => {
  //if (!refreshingQuery) {
  // return [];
  // }
  // return people.filter(person => person.name.includes(refreshingQuery));
  //}, [refreshingQuery, people]);

  const filteredPeople = useMemo(() => {
    if (refreshingQuery) {
      return people.filter(person => person.name.includes(refreshingQuery));
    }

    return isOpen ? people : [];
  }, [refreshingQuery, people, isOpen]);

  //};
  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-qa="search-input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          data-qa="suggestions-list"
        >
          <div className="dropdown-content">
            {filteredPeople.length !== 0 ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-qa="suggestion-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handlePersonClick(person)}
                  style={{ cursor: 'pointer' }}
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
                //data-qa="no-suggestions-message"
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
