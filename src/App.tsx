import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const debounce = (
  func: React.Dispatch<React.SetStateAction<string>>
  | React.Dispatch<React.SetStateAction<boolean>>,
  delay: number,
) => {
  let timer: number;

  return (arg: string | boolean) => {
    clearTimeout(timer);
    timer = setTimeout(func, delay, arg);
  };
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [appliedQuery, setAppliedQuery] = useState('');
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const delay = 1000;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const showDropdownAfterTyping = useCallback(
    debounce(setIsActive, delay),
    [],
  );

  const getRidOfDropdown = useCallback(
    debounce(setIsActive, delay / 4),
    [],
  );

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    getRidOfDropdown(false);
  };

  const handleSelected = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    e.preventDefault();
    setSelectedPerson(person);
    setAppliedQuery('');
    setIsActive(false);
    setQuery('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setIsActive(false);
    showDropdownAfterTyping(true);
  };

  const visiblePeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': isActive,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length
              ? (visiblePeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.name}
                >
                  <a
                    href="http//"
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={e => handleSelected(e, person)}
                  >
                    {person.name}
                  </a>
                </div>
              )))
              : (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
