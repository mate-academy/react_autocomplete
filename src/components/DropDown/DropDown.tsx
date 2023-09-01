import cn from 'classnames';
import { useState, useMemo, useCallback } from 'react';
import { Person } from '../../types/Person';

type Props = {
  persons: Person[];
  onSelectPerson: (person:Person | null) => void;
  delay: number;
};

// eslint-disable-next-line
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const DropDown: React.FC<Props> = ({
  persons,
  onSelectPerson,
  delay,
}) => {
  const [apliedQuery, setApliedQuery] = useState('');
  const [query, setQuery] = useState('');
  const [isDropDownShow, setIsDropDownShow] = useState(false);

  const applyQuery = useCallback(debounce(setApliedQuery, delay), []);

  const filteredPersonsList = useMemo(() => (
    persons.filter((person: Person) => (
      person.name.toLowerCase().includes(apliedQuery.toLowerCase().trim())))),
  [persons, apliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectPerson(null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': isDropDownShow,
      })}
    >
      <div className="dropdown-trigger">
        <input
          onFocus={() => {
            setIsDropDownShow(true);
          }}
          onBlur={() => setIsDropDownShow(false)}
          value={query}
          onChange={handleInputChange}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPersonsList.length > 0 ? (
            filteredPersonsList.map((person) => (
              <a
                href="\"
                className="dropdown-item"
                key={person.slug}
                onMouseDown={() => {
                  setQuery(person.name);
                  setIsDropDownShow(false);
                  onSelectPerson(person);
                }}
              >
                <p
                  className={cn(
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                  )}
                >
                  {person.name}
                </p>
              </a>
            ))
          ) : (
            <p>No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};
