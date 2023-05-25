import React, { useMemo, useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

function debounce(callback:(...args: string[])=> void, delay: number) {
  let timerId = 0;

  return (...args: string[]) => {
    clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [titel, setTitle] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = debounce(setTitle, 1000);

  const hendlerPerson = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    applyQuery(e.target.value);
  };

  const findPersons = useMemo(() => (
    peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(input.toLowerCase().trim())))
  ), [titel]);

  const getPerson = (person: Person) => {
    setTitle(person.name);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No person is selected')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={input}
            onChange={hendlerPerson}
          />
        </div>
        {findPersons.length === 0 && (<p>No matching suggestions</p>)}
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              {input ? findPersons.map((person) => (
                <button
                  type="button"
                  className="button"
                  key={person.name}
                  onClick={() => {
                    setSelectedPerson(person);
                    getPerson(person);
                    setInput('');
                    setTitle('');
                  }}
                >
                  {person.name}
                </button>
              )) : ''}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
