import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const peoples = peopleFromServer;
  const [persons, setPersons] = useState('');

  const handleChangePerson = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersons(event.target.value);
  };

  const selectedPerson = peoples.find(people => people.name === persons);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={persons}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            list="select"
            onChange={handleChangePerson}
          />
          <datalist id="select">
            {peoples.map((people) => (
              // eslint-disable-next-line jsx-a11y/control-has-associated-label
              <option key={people.name} value={people.name} />
            ))}
          </datalist>
        </div>
      </div>
    </main>
  );
};
