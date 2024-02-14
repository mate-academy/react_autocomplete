import React, { useCallback, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { preparePeople } from './utils/preparePeople';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);

  // eslint-disable-next-line
  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), 1000),
    [],
  );

  const handleOnClick = (eventOnClick: React.MouseEvent, person: Person) => {
    eventOnClick.preventDefault();

    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsListShown(false);
  };

  const onBlurDelay = () => {
    setTimeout(() => setIsListShown(false), 100);
  };

  const handleReset = () => {
    setSelectedPerson(null);
    setAppliedQuery('');
    setQuery('');
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const preparedPeopleList = preparePeople(peopleFromServer, appliedQuery);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger control has-icons-right">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => handleOnChange(event)}
            onFocus={() => setIsListShown(true)}
            onBlur={onBlurDelay}
          />
          {selectedPerson && (
            <span className="icon is-small is-right">
              <button
                onClick={handleReset}
                type="button"
                className="delete is-small"
              >
                x
              </button>
            </span>
          )}
        </div>

        <div
          style={{
            display: isListShown ? 'block' : 'none',
          }}
          className="dropdown-menu"
          role="menu"
        >
          <div className="dropdown-content">
            {!preparedPeopleList.length ? (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            ) : (
              preparedPeopleList.map(person => (
                <a
                  href="/"
                  onClick={event => handleOnClick(event, person)}
                  className="dropdown-item"
                  key={person.slug}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
