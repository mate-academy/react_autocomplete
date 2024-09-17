import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import { useClickAway } from 'react-use';
import { Person } from '../types/Person';

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

    const handleDropdown = (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsDropdownOpen(false);
    };

    useEffect(() => {
      if (appliedQuery.trim().length > 0) {
        setIsDropdownOpen(true);
      }
    }, [appliedQuery]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      setIsDropdownOpen(false);
      onSelected(null);
    };

    const handleInputFocus = () => {
      setIsDropdownOpen(true);
    };

    useClickAway(dropdownMenuRef, () => {
      setIsDropdownOpen(false);
    });

    const filteredPeople = useMemo(() => {
      return people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }, [appliedQuery, people]);

    return (
      <>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={handleInputFocus}
              onChange={handleQueryChange}
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
