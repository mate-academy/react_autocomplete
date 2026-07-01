import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface AutocompleteProps {
  people: Person[];
  onPersonSelect ?: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete = ({
  people,
  onPersonSelect = () => {},
  delay,
}: AutocompleteProps) => {
  const effectiveDelay = delay ?? 300;

  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);

  const [isOpen, setIsOpen] = useState(false);

  const debouncedFilter = useMemo(
    () =>
      debounce((searchText: string) => {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(searchText.toLowerCase()),
          ),
        );
      }, effectiveDelay),
    [people, effectiveDelay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    if (text === query) {
      return;
    }

    setQuery(text);
    setIsOpen(true);
    onPersonSelect(null);

    if (text.trim().length === 0) {
      setFilteredPeople(people);
    } else {
      debouncedFilter(text.trim());
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (query.trim().length === 0) {
      setFilteredPeople(people);
    }
  };

  const handleSelect = (user: Person) => {
    onPersonSelect(user);
    setQuery(user.name);
    setIsOpen(false);
  };

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(user => (
              <div
                style={{ cursor: 'pointer' }}
                className="dropdown-item"
                data-cy="suggestion-item"
                key={user.slug || user.name}
                onClick={() => handleSelect(user)}
              >
                <p
                  className={classNames(
                    `has-text-${user.sex === 'm' ? 'link' : 'danger'}`,
                  )}
                >
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && query.trim() !== '' && isOpen && (
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
    </>
  );
};
