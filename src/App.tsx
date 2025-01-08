import React, { useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );
  const delay = 300;

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const applyQuery = useMemo(
    () =>
      debounce((currentQuery: string) => {
        setAppliedQuery(currentQuery);
      }, delay),
    [setAppliedQuery],
  );

  React.useEffect(() => {
    if (filteredPeople.length === 0) {
      setIsActive(false);
    }
  }, [filteredPeople]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  const handleTitle = (person: Person | null) => {
    return person
      ? `${person.name} (${person.born} - ${person.died})`
      : 'No selected person';
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsActive(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {handleTitle(selectedPerson)}
        </h1>

        <div className={classNames('dropdown', { 'is-active': isActive })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                >
                  <p
                    className="has-text-danger"
                    onMouseDown={() => handleSelectedPerson(person)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
