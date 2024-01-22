import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  selectPerson: (person: Person | null) => void,
};

export const Dropdown: React.FC<Props> = React.memo(
  ({
    people,
    selectPerson,
  }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showListOfPeople, setShowListOfPeople] = useState(false);

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

    const applyQuery = useCallback(
      debounce(setAppliedQuery, 1000),
      [],
    );

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const onMouseDown
      = (person: Person) => {
        setQuery(person.name);
        setAppliedQuery(person.name);
        selectPerson(person);
        setShowListOfPeople(false);
      };

    const filteredNames = React.useMemo(() => {
      return people
        .filter(item => item.name.toLocaleLowerCase()
          .includes(appliedQuery.toLocaleLowerCase()));
    }, [people, appliedQuery]);

    const handleClear = useCallback(() => {
      setShowListOfPeople(false);
      setQuery('');
      setAppliedQuery('');
    }, []);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowListOfPeople(true)}
            onBlur={() => setShowListOfPeople(false)}
          />
        </div>
        <button
          aria-label="Close dropdown"
          onClick={handleClear}
          type="button"
          className={cn(
            'button_delete delete is-medium',
            { 'is-hidden': query === '' && !showListOfPeople },
          )}
        />

        {showListOfPeople && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredNames.map(person => (
                <button
                  type="button"
                  className={cn(
                    'dropdown-item',
                    { 'has-text-link': person.sex === 'm' },
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                  key={person.slug}
                  onMouseDown={() => onMouseDown(person)}
                >
                  {person.name}
                </button>
              ))}

              {filteredNames.length === 0
                && (
                  <div className="dropdown-item">
                    No matching suggestions
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
