import React, { useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people] = useState(peopleFromServer);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(value);
    }, 1000);
  };

  const handleOnPersonClick = (person: Person) => {
    setSelectedPerson(person);
    setIsDropdownActive(false);
    setQuery(person.name);
  };

  const handlePersonKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    if (event.key === 'Enter') {
      setSelectedPerson(person);
    }
  };

  const filteredPeople = useMemo(() => {
    return (
      people.filter(person => (
        person.name.toLowerCase().includes(appliedQuery.toLowerCase())
      ))
    );
  }, [appliedQuery, people]);

  /* eslint-disable */
  console.log('render');

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            autoComplete="off"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onClick={() => {
              setIsDropdownActive(!isDropdownActive);
            }}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
        >
          {isDropdownActive && (
            <div
              className="dropdown-content"
            >
              {filteredPeople.length
                ? (filteredPeople.map(person => {
                  const isSelectedPerson = selectedPerson?.slug === person.slug;

                  return (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOnPersonClick(person)}
                      onKeyDown={(event) => handlePersonKeyDown(event, person)}
                    >
                      <p
                        className={cn(
                          'has-text-link',
                          {
                            'has-text-danger': isSelectedPerson,
                          },
                        )}
                      >
                        {person.name}
                      </p>
                    </div>
                  );
                })
                ) : (
                  'No matching suggestions'
                )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
