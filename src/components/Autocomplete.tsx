import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface Props {
  people: Person[];
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
}

// eslint-disable-next-line react/display-name
const Autocomplete: React.FC<Props> = React.memo(
  ({ people, debounceDelay = 300, onSelected }) => {
    const [query, setQuery] = useState('');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [debounceQuery, setdebounceQuery] = useState(query);
    const [isFocused, setFocus] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSelectedPerson(null);
    };

    useEffect(() => {
      const handler = setTimeout(() => setdebounceQuery(query), debounceDelay);

      return () => clearTimeout(handler);
    }, [query, debounceDelay]);

    const filteredPeople = useMemo(() => {
      if (!debounceQuery.trim()) {
        return isFocused ? people : [];
      }

      return people.filter(p =>
        p.name.toLocaleLowerCase().includes(debounceQuery.toLocaleLowerCase()),
      );
    }, [debounceQuery, people, isFocused]);

    const handlePersonSelect = (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      onSelected(person);
    };

    const handleFocus = () => {
      setFocus(true);

      if (!query.trim()) {
        setdebounceQuery('');
      }
    };

    const handleBlur = () => {
      setFocus(false);
    };

    useEffect(() => {
      if (!query) {
        setSelectedPerson(null);
        onSelected(null);
      }
    }, [query, onSelected]);

    return (
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          <h1 className="title" data-cy="title">
            {selectedPerson
              ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
              : `No selected person`}
          </h1>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              data-cy="search-input"
            />
          </div>

          <div
            className={classNames('dropdown', {
              'is-active':
                isFocused && (!selectedPerson || filteredPeople.length > 0),
            })}
          >
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.length > 0 &&
                  filteredPeople.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onClick={() => handlePersonSelect(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))}
                {debounceQuery.trim() && filteredPeople.length === 0 && (
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
        </main>
      </div>
    );
  },
);

export default Autocomplete;
