import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import Users from './data/Users';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [apliedQuery, setApliedQuery] = useState('');
  const BIGGER_DELAY_THAN_USESTATE = 100;

  function setDelayForBlur(time: number) {
    setTimeout(() => setVisible(false), time);
  }

  const peopleFilter = (people: Person[], queryWord: string) => {
    return people.filter(person => person.name
      .toLowerCase().includes(queryWord.toLowerCase()));
  };

  let filteredPeople: Person[]
    = peopleFromServer;

  if (query) {
    filteredPeople = peopleFilter(peopleFromServer, apliedQuery);
  }

  const handleOnClick = (event:
  React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };

  const handleInputChange = useCallback(
    debounce((value) => {
      setApliedQuery(value);
    }, 500),
    [],
  );

  return (
    <main className="section">
      {selectedPerson && (
        <h1 className="title">
          {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
        </h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onBlur={() => setDelayForBlur(BIGGER_DELAY_THAN_USESTATE)}
            onFocus={() => setVisible(true)}
            onChange={(event) => {
              handleInputChange(event.target.value);
              setQuery(event.target.value);
            }}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          style={{ display: visible ? 'block' : 'none' }}
        >
          <div className="dropdown-content">
            {!filteredPeople.length ? (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            ) : (
              <Users
                filteredPeople={filteredPeople}
                setSelectedPerson={setSelectedPerson}
                setQuery={setQuery}
                handleOnClick={handleOnClick}
                setApliedQuery={setApliedQuery}
              />
            )}

          </div>
        </div>
      </div>
    </main>
  );
};
