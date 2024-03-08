import React, { useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { useClickAway } from 'react-use';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, onSelected = () => {}, delay = 300 }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownMenuRef = useRef<HTMLDivElement>(null);

    const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

    const filteredPeople = useMemo(() => {
      return people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }, [appliedQuery, people]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelected(null);
      setIsDropdownOpen(true);
    };

    const handleDropdown = (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsDropdownOpen(false);
    };

    const handleInputFocus = () => {
      setIsDropdownOpen(true);
    };

    useClickAway(dropdownMenuRef, () => {
      setIsDropdownOpen(false);
    });

    return (
      <>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
              onFocus={handleInputFocus}
              value={query}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            ref={dropdownMenuRef}
          >
            {isDropdownOpen && filteredPeople.length > 0 && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <button
                    className="dropdown-item button is-white"
                    data-cy="suggestion-item"
                    type="button"
                    key={person.name}
                    onClick={() => handleDropdown(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
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
      </>
    );
  },
);
