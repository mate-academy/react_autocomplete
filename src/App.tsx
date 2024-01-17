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
  const [choosedperson, setChoosedperson] = useState<Person | null>(null);

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
      setChoosedperson(person);
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
    setChoosedperson(null);
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
      {choosedperson ? (
        <div className="section-person">
          <h1 className="title">
            {`${choosedperson.name} (${choosedperson.born} = ${choosedperson.died})`}
          </h1>
          <button
            onClick={handleReset}
            type="button"
            className="delete ml-1 mt-2 is-medium"
          >
            x
          </button>
        </div>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            onBlur={delayOnBlur}
            onFocus={() => setVisible(true)}
            onChange={event => handleOnChange(event)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
          />
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
