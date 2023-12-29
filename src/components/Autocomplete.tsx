import classNames from 'classnames';
import React, {
  useMemo,
  useState,
} from 'react';

import { Person } from '../types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  people: Person[];
  onSelect?: React.Dispatch<React.SetStateAction<Person | null>>;
  delay: number;
  selectedPerson: Person | null;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    people,
    onSelect = () => {},
    delay,
    selectedPerson,
  }) => {
    const [query, setQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [appliedQuery, setAppliedQuery] = useState('');

    const applyQuery = debounce(setAppliedQuery, delay);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const filteredPeople = useMemo(() => {
      if (!query || query === selectedPerson?.name) {
        return people;
      }

      return people.filter(
        person => {
          return person.name.toUpperCase().includes(
            appliedQuery.trim().toUpperCase(),
          );
        },
      );
    }, [appliedQuery, query, people, selectedPerson?.name]);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
          />
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">

              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onMouseDown={() => {
                    onSelect(person);
                    setQuery(person.name);
                    setIsDropdownOpen(false);
                  }}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex={0}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'f',
                      'has-text-danger': person.sex === 'm',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}

              {!filteredPeople.length && 'No matching suggestions'}

            </div>
          </div>
        )}

      </div>
    );
  },
);
