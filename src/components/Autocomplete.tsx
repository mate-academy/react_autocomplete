import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
}

const Autocomplete: React.FC<Props> = ({
  people,
  onSelect = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAppliedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, delay]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(null);
    setQuery(event.target.value);
  };

  const handleChangePerson = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsOpen(false);
    onSelect(person);
  };

  const filteredPeople = useMemo(() => {
    const normalized = appliedQuery.toLowerCase().trim();

    return people.filter(person =>
      person.name.toLowerCase().includes(normalized),
    );
  }, [appliedQuery, people]);

  return (
    <>
      <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleChangeQuery}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {filteredPeople.length !== 0 && isOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleChangePerson(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredPeople.length === 0 && isOpen && (
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

export default Autocomplete;
