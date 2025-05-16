import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [select, setSelect] = useState(false);
  const [listOfPeople, setListOfPeople] = useState([...peopleFromServer]);
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectPerson(null);
    setSelect(false);
    setListOfPeople(
      [...peopleFromServer].filter(people =>
        people.name.includes(`${event.target.value}`),
      ),
    );

    if (event.target.value === '') {
      setListOfPeople([...peopleFromServer]);

      return;
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {select ? (
          <h1 className="title" data-cy="title">
            {`${selectPerson?.name} (${selectPerson?.born} - ${selectPerson?.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {listOfPeople.length > 0 ? (
                listOfPeople.map((person, i) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={i}
                  >
                    <p
                      className="has-text-link"
                      onClick={() => {
                        setSelectPerson(listOfPeople[i]);
                        setQuery(`${listOfPeople[i].name}`);
                        setListOfPeople(
                          listOfPeople.filter(
                            people => people.name === listOfPeople[i].name,
                          ),
                        );
                        setSelect(true);
                      }}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
              ) : (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
