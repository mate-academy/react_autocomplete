import React, { useCallback, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  persons: Person[];
  onSelected: (person: Person) => void;
  debounceDelay: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    persons, onSelected, debounceDelay,
  }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // eslint-disable-next-line @typescript-eslint/ban-types
    function debounce(callback: Function, delay: number) {
      let timerId = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: any) => {
        window.clearTimeout(timerId);

        timerId = window.setTimeout(() => {
          callback(...args);
        }, delay);
      };
    }

    const applyQuery
      = useCallback(debounce(setAppliedQuery, debounceDelay), []);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;

      setQuery(text);
      applyQuery(text);
    };

    const filterPeople = React.useMemo(
      () => {
        return persons.filter((person) => {
          return (
            person.name.toLowerCase().includes(appliedQuery.toLowerCase())
          );
        });
      }, [persons, appliedQuery],
    );

    const onMouseDown
      = (event:
      React.MouseEvent<HTMLAnchorElement, MouseEvent>, person: Person) => {
        event.preventDefault();
        setQuery(person.name);
        setAppliedQuery(person.name);
        onSelected(person);
        setShowDropdown(false);
      };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
          />
        </div>

        {showDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content has-text-link">
              {filterPeople.map(person => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  href="#"
                  key={person.slug}
                  className="dropdown-item"
                  onMouseDown={(event) => onMouseDown(event, person)}
                >
                  {person.name}
                </a>
              ))}

              {filterPeople.length === 0 && (
                <div className="dropdown-item">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
