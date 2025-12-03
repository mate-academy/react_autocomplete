import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ people, onSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');

  const apllyQuery = useCallback(debounce(setApliedQuery, 300), []);

  const handleSelect = (person: Person) => {
    onSelected(person);
    setIsOpen(false);
    setQuery(person.name);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(null);
    setQuery(event.target.value);
    apllyQuery(event.target.value);
    setIsOpen(true);
  };

  const filteredPeoples = useMemo(() => {
    return people.filter(man =>
      man.name.toLowerCase().includes(apliedQuery.trim().toLowerCase())
    );
  }, [apliedQuery, people]);

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
            onChange={handleInput}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeoples.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeoples.length === 0 && query !== '' && (
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
