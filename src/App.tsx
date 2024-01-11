import React, { useCallback, useEffect, useState } from 'react';
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
  const [people, setPeople] = useState(peopleWithId);
  const [querry, setQuery] = useState('');
  const [message, setMessage] = useState(false);
  const [appliedQuerry, setAppliedQuerry] = useState('');
  const [appliedMessage, setAppliedMessage] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    setPeople(peopleWithId.filter(person => person.name
      .includes(appliedQuerry)));

    if (!querry) {
      setSelectedPerson(null);
    }
  }, [appliedQuerry]);

  const applyQuerry = useCallback(debounce(setAppliedQuerry,
    setAppliedMessage, 1000), []);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuerry = e.target.value;

    setMessage(people.length === 0);
    setQuery(newQuerry);
    applyQuerry(newQuerry, message);
  };

  const handleSelectedPerson = (e: React.MouseEvent<HTMLAnchorElement>,
    person: Person) => {
    e.preventDefault();
    setQuery(person.name);
    setSelectedPerson(person);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <main className="section">

      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={querry}
              onChange={handleQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {appliedMessage && <div> No matching suggestions </div>}
            {!appliedMessage && isFocused
              && people.map((person) => (
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
