import { useState, useEffect } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type AutocompleteProps = {
  onSelected: (person: Person) => void;
  delay?: number;
  onInputChange: () => void;
};

export const Autocomplete = ({
  onSelected,
  delay = 300,
  onInputChange,
}: AutocompleteProps) => {
  const people = peopleFromServer;
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredPeople(
        people.filter(person =>
          person.name.toLowerCase().includes(query.trim().toLowerCase()),
        ),
      );
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay, people]);

  const notFound = query !== '' && filteredPeople.length === 0;

  const handleSelected = (person: Person) => {
    onSelected(person);
    setIsOpen(false);
    setQuery(person.name);
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
          onChange={event => {
            setQuery(event.target.value);
            onInputChange();
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {!notFound ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSelected(person)}
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
      )}
    </div>
  );
};
