import React, { useState, useMemo, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const delay = 1000;

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsDropdownActive(false);
  };

  const visiblePeople = useMemo(() => {
    setIsDropdownActive(!!appliedQuery);

    if (!appliedQuery) {
      setSelectedPerson(null);
      setIsDropdownActive(false);
    } else {
      setIsDropdownActive(true);
    }

    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(
        appliedQuery.trim().toLowerCase(),
      ),
    );
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': isDropdownActive,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length > 0 ? (
              visiblePeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                >
                  <tr
                    className={cn('has-text-link', {
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => handleClick(person)}
                  >
                    <td>{person.name}</td>
                  </tr>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">No matches</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
