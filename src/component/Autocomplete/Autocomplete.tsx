import React, { useState, useRef, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  people: Person[];
  onSelect?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, onSelect = () => {}, delay = 3000 }) => {
    const [query, setQuery] = useState('');
    const [filteredPeople, setFilteredPeople] =
      useState<Person[]>(peopleFromServer);
    const [isFocused, setIsFocused] = useState(false);
    const titleField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, []);

    const filtered = useMemo(() => {
      return people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );
    }, [query, people]);

    const debouncedFilterPeople = debounce(
      () => setFilteredPeople(filtered),
      delay,
    );

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      onSelect(null);
      debouncedFilterPeople();
    };

    const handlePersonChosen = (person: Person) => {
      setQuery(person.name);
      onSelect(person);
      setIsFocused(false);
    };

    const handleInputFocus = () => {
      setIsFocused(true);
    };

    return (
      <div className={`dropdown ${isFocused && 'is-active'}`}>
        <div className="dropdown-trigger">
          <input
            ref={titleField}
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={handleInputFocus}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {isFocused && (
            <div className="dropdown-content">
              {filteredPeople.map((person: Person) => {
                return (
                  <div className="dropdown-item" data-cy="suggestion-item">
                    <p
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                      role="button"
                      key={person.name}
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                      onClick={() => handlePersonChosen(person)}
                      onKeyDown={() => handlePersonChosen(person)}
                      tabIndex={0}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
    );
  },
);
