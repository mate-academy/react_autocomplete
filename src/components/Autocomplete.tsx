import cn from 'classnames';
import { FC, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import useDebounce from '../hooks/useDebounce';
import DropdownItem from './DropdownItem';

type Props = {
  people: Person[];
  query: string;
  onSelectedPerson: (person: Person | null) => void;
  onQueryChange: (char: string) => void;
  delay?: number;
};

const Autocomplete: FC<Props> = ({
  delay,
  onQueryChange,
  onSelectedPerson,
  people,
  query,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce<string>(query, delay ?? 300);

  const filteredPeople = useMemo(() => {
    const clearedQuery = debouncedQuery.trim().toLowerCase();

    if (!clearedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(clearedQuery),
    );
  }, [debouncedQuery, people]);

  const handleInputChange = (value: string) => {
    if (value !== query) {
      onQueryChange(value);
      onSelectedPerson(null);
      setIsOpen(true);
    }
  };

  const handleSelect = (person: Person) => {
    onSelectedPerson(person);
    onQueryChange(person.name);
    setIsOpen(false);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={event => handleInputChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 100);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <DropdownItem
                key={person.slug}
                person={person}
                handleSelect={handleSelect}
              />
            ))
          ) : (
            <div
              className="notification is-danger is-light
                     mt-3 is-align-self-flex-start"
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

export default Autocomplete;
