import React, { useCallback, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [choosedPerson, setchoosedPerson] = useState<Person | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const apllyQuery = useCallback(
    debounce((value: string) => setApliedQuery(value), 1000),
    [],
  );

  const handleOnClick
    = (eventOnClick: React.MouseEvent, person: Person) => {
      eventOnClick.preventDefault();

      setQuery(person.name);
      setApliedQuery(person.name);
      setVisible(false);
      setchoosedPerson(person);
    };

  const preparedList = (people: Person[], queryFilter: string) => {
    const queryNormalized = queryFilter.toLocaleLowerCase();

    return people.filter(person => person.name.toLocaleLowerCase()
      .includes(queryNormalized));
  };

  const delayOnBlur = () => {
    setTimeout(() => setVisible(false), 100);
  };

  const handleReset = () => {
    setchoosedPerson(null);
    setApliedQuery('');
    setQuery('');
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    apllyQuery(event.target.value);
  };

  const preparedPeopleList = preparedList(peopleFromServer, apliedQuery);

  return (
    <main className="section">
      {choosedPerson ? (
        <h1 className="title">
          {`${choosedPerson.name} (${choosedPerson.born} = ${choosedPerson.died})`}
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
            onChange={event => handleOnChange(event)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
          />
          {choosedPerson && (
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
          className="dropdown-menu"
          role="menu"
          style={{
            display: visible ? 'block' : 'none',
          }}
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
