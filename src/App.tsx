import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [searchedPerson, setsearchedPerson] = useState('');

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setsearchedPerson(event.target.value);

    const filteredPeople = people.filter(person => {
      return (person.name)
        .toLocaleLowerCase().includes(searchedPerson.toLocaleLowerCase());
    });

    setPeople(filteredPeople);
  };

  return (
    <main className="section">
      <h1 className="title">
        Selected person
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchedPerson}
            onChange={(event) => handleSelectionChange(event)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.map(person => (
              <div className="dropdown-item">
                <p className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}>{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
