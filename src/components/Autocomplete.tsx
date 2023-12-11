import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

export type Props = {
  peopleFromServer: Person[],
  setMyPerson: (person: Person | null) => void,
  delay: number,
};

enum Sex {
  Male = 'm',
  Female = 'f',
}

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  setMyPerson,
  delay,
}) => {
  const [select, setSelect] = useState(false);
  const [query, setQuery] = useState('');
  const [chosePerson, setChosePerson] = useState('');

  const applyQuery = useMemo(
    () => debounce(setQuery, delay), [delay],
  );

  const filteredPeoples = useMemo(() => {
    if (!query) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(
      (person: Person) => person.name
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [peopleFromServer, query]);

  const chosenPerson = (
    person: Person,
  ) => {
    setMyPerson(person);
    setChosePerson(person.name);
    setSelect(false);
  };

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setMyPerson(null);
    }

    setChosePerson(e.target.value);
    applyQuery(e.target.value);
  };

  const handleFocus = () => {
    setSelect(true);
  };

  const handleBlur = () => {
    setSelect(false);
    setQuery('');
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': select && (chosePerson === query || query === ''),
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={chosePerson}
          onChange={handleChangeQuery}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeoples.length > 0 ? (
            filteredPeoples.map((person: Person) => (
              <button
                type="button"
                className="dropdown-item button is-white"
                key={person.slug}
                onMouseDown={() => chosenPerson(person)}
              >
                <p
                  className={cn(
                    person.sex === Sex.Male
                      ? 'has-text-link'
                      : 'has-text-danger',
                  )}
                >
                  {person.name}
                </p>
              </button>
            ))
          ) : (
            <div className="dropdown-item">
              <p className="has-text-link">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
