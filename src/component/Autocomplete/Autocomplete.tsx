import React, { useState, useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
// import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  people: Person[];
  onSelect?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, onSelect = () => {} }) => {
    const [query, setQuery] = useState('');
    const [filteredPeople, setFilteredPeople] =
      useState<Person[]>(peopleFromServer);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const titleField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, []);

    // const debouncedFilterPeople = useRef(
    //   debounce((value: string) => {
    //     const filtered = people.filter(person =>
    //       person.name.toLowerCase().includes(value.toLowerCase().trim()),
    //     );

    //     setFilteredPeople(filtered);
    //   }, delay),
    // ).current;

    const filtered = useMemo(() => {
      return people.filter((person: Person) =>
        person.name.toLowerCase().includes(query.toLowerCase().trim()),
      );
    }, [people, query]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;

      setQuery(text);
      onSelect(null);
      setFilteredPeople(filtered);
      if (text.trim() === '') {
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true);
      }
    };

    const handlePersonChosen = (person: Person) => {
      setQuery(person.name);
      onSelect(person);
      setShowSuggestions(false);
    };

    const handleInputFocus = () => {
      if (!query) {
        setShowSuggestions(true);
      }
    };

    useEffect(() => {
      if (!query) {
        setFilteredPeople(peopleFromServer);

        return;
      }

      setFilteredPeople(filtered);
    }, [query, filtered]);

    return (
      <div className={classNames('dropdown', { 'is-active': showSuggestions })}>
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
          {showSuggestions &&
            (filteredPeople.length > 0 ? (
              <div className="dropdown-content">
                {filteredPeople.map((person: Person) => (
                  <div className="dropdown-item" data-cy="suggestion-item">
                    <p
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                      role="button"
                      key={person.name}
                      className={classNames({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      onClick={() => handlePersonChosen(person)}
                      onKeyDown={() => handlePersonChosen(person)}
                      tabIndex={0}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
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
            ))}
        </div>
      </div>
    );
  },
);
