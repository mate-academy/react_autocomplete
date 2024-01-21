import React, { useCallback, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [confirmedQuery, setConfirmedQuery] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const confirmQuery = useCallback(
    debounce((value: string) => setConfirmedQuery(value), 1000),
    [],
  );

  const onClickHandler
    = (eventOnClick: React.MouseEvent, person: Person) => {
      eventOnClick.preventDefault();

      setQuery(person.name);
      setConfirmedQuery(person.name);
      setVisible(false);
      setSelectedPerson(person);
    };

  const filteredPeople = (people: Person[], queryVal: string) => {
    const queryNormalized = queryVal.toLocaleLowerCase();

    return people.filter(person => person.name.toLocaleLowerCase()
      .includes(queryNormalized));
  };

  const delayOnBlur = () => {
    setTimeout(() => setVisible(false), 100);
  };

  const resetHandler = () => {
    setSelectedPerson(null);
    setConfirmedQuery('');
    setQuery('');
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    confirmQuery(event.target.value);
  };

  const filteredPeopleList = filteredPeople(peopleFromServer, confirmedQuery);

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
            onBlur={delayOnBlur}
            onFocus={() => setVisible(true)}
            onChange={event => onChangeHandler(event)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
          />
          {selectedPerson && (
            <span className="icon is-small is-right">
              <button
                onClick={resetHandler}
                type="button"
                className="delete is-small"
              >
                x
              </button>
            </span>
          )}
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          style={{
            display: isVisible ? 'block' : 'none',
          }}
        >
          <div className="dropdown-content">
            {!filteredPeopleList.length ? (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            ) : (
              filteredPeopleList.map(person => (
                <a
                  href="/"
                  onClick={event => onClickHandler(event, person)}
                  className="dropdown-item"
                  key={person.slug}
                >
                  <p
                    className={classNames({
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
