/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import cn from 'classnames';

function filterPeople(people: Person[], searchQuery: string): Person[] {
  const searchLower = searchQuery.toLowerCase().trim();

  return people.filter(person => {
    const nameLower = person.name.toLowerCase();

    return nameLower.includes(searchLower);
  });
}

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => callback(...args), delay);
  };
}

export const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const peopleList: Person[] = useMemo(
    () => filterPeople(peopleFromServer, appliedQuery),
    [appliedQuery],
  );

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);
  const unfocus = useCallback(
    debounce(() => setIsVisible(false), 150),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSelectedPerson(null);
    setSearchQuery(value);
    applyQuery(value);
  };

  const handleOptionClick = (person: Person) => {
    const value = person.name;

    setSelectedPerson(person);
    setSearchQuery(value);
    setIsVisible(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isVisible })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsVisible(true)}
              onBlur={() => unfocus()}
            />
          </div>

          {isVisible && !!peopleList.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {peopleList.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleOptionClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!peopleList.length && (
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
      </main>
    </div>
  );
};
