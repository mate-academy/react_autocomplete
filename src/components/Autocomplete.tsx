import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  onSelect?: (person: Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    people,
    onSelect = () => {},
    delay,
  }) => {
    const [query, setQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [appliedQuery, setApliedQuery] = useState('');

    const isLoading = query !== appliedQuery;

    console.log(isLoading);

    const applyQuery = useCallback(() => debounce(
      setApliedQuery, delay,
    ), [setApliedQuery, delay]);

    const personField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (personField.current) {
        personField.current.focus();
      }
    }, []);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery();
    };

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const element = event.relatedTarget;

      if (element && element.className === 'dropdown-item') {
        return;
      }

      setIsDropdownOpen(false);
    };

    const filteredPeople = useMemo(() => {
      if (!query) {
        return people;
      }

      return people.filter(
        person => {
          return person.name.toUpperCase().includes(
            appliedQuery.trim().toUpperCase(),
          );
        },
      );
    }, [appliedQuery, query, people]);

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
            onBlur={handleOnBlur}
          />
        </div>

        {isDropdownOpen && !isLoading && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">

              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => {
                    onSelect(person);
                    setQuery(person.name);
                    setIsDropdownOpen(false);
                  }}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex={0}
                  ref={personField}
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
