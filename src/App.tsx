import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

const peopleWithId = peopleFromServer.map((person, id) => ({
  ...person,
  id,
}));

function debounce(setAppliedQuerry: any,
  setAppliedMessage: any, delay: number) {
  let timerId = 0;

  return (querry: string, message: boolean) => {
    window.clearInterval(timerId);
    timerId = window.setTimeout(() => {
      setAppliedQuerry(querry);
      setAppliedMessage(message);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [people] = useState(peopleWithId);
  const [querry, setQuery] = useState('');
  const [message, setMessage] = useState(false);
  const [appliedQuerry, setAppliedQuerry] = useState('');
  const [appliedMessage, setAppliedMessage] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name
      .includes(appliedQuerry) && appliedQuerry);
  }, [appliedQuerry, appliedMessage, people]);

  const applyQuerry = useCallback(debounce(setAppliedQuerry,
    setAppliedMessage, 1000), []);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppliedQuerry('');
    setAppliedMessage(false);
    setMessage(filteredPeople.length === 0);
    setQuery(e.target.value);
    applyQuerry(querry, message);
  };

  const handleSelectedPerson = (e: React.MouseEvent<HTMLAnchorElement>,
    person: Person) => {
    e.preventDefault();
    setQuery(person.name);
    setSelectedPerson(person);
  };

  return (
    <main className="section">

      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={querry}
            onChange={handleQuery}
          />
        </div>
      </div>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">

          <button
            type="button"
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>Dropdown button</span>
            <span className="icon is-small">
              <i className="fas fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {appliedMessage && <div> No matching suggestions </div>}
            {querry && appliedQuerry && !appliedMessage
              && filteredPeople.map((person) => (
                <a
                  href="#select"
                  className="dropdown-item"
                  key={person.id}
                  onClick={(e) => handleSelectedPerson(e, person)}
                >
                  {person.name}
                </a>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};
