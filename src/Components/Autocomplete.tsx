import { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};
export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyQuery = useMemo(
    () =>
      debounce((value: string) => {
        setAppliedQuery(value);
      }, delay),
    [delay],
  );

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredPeople = useMemo(() => {
  if (!appliedQuery.trim()) {
    return [];
  }

  return people.filter(person =>
    person.name
      .toLowerCase()
      .includes(appliedQuery.toLowerCase()),
  );
}, [appliedQuery, people]);

  const suggestions =
  isOpen && query.trim() === ''
    ? people
    : filteredPeople;


  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    if (newQuery === query) {
      return;
    }

    setQuery(newQuery);
    setIsOpen(true);
    applyQuery(newQuery);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={query}
          data-qa="search-input"
          data-cy="search-input"
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content"
        data-qa ="suggestions-list"
        data-cy ="suggestions-list">
          {suggestions.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-qa="suggestion-item"
              data-cy="suggestion-item"
              onClick={() => handleSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {isOpen && appliedQuery.trim() !== '' && filteredPeople.length === 0 && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start"
          role="alert"
          data-qa="no-suggestions-message"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
