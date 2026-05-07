import { useEffect, useMemo, useState } from 'react';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setAppliedQuery(query.trim());
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [query, delay]);

  const visiblePeople = useMemo(() => {
    if (!appliedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    if (selectedPerson && value !== selectedPerson.name) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);

    setQuery(person.name);
    setAppliedQuery(person.name);

    setIsFocused(false);

    onSelected(person);
  };

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {visiblePeople.length > 0 ? (
            visiblePeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          ) : (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
