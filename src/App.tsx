import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

const peopleWithId = peopleFromServer.map((person, id) => {
  return { ...person, id };
});

function debounce(setAppliedQuerry: any, delay: number) {
  let timerId = 0;

  return (querry: string) => {
    window.clearInterval(timerId);
    timerId = window.setTimeout(() => {
      setAppliedQuerry(querry);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [querry, setQuery] = useState('');
  const [appliedQuerry, setAppliedQuerry] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const people = useMemo(() => {
    return peopleWithId.filter(person => person.name.toLowerCase()
      .includes(appliedQuerry.toLowerCase()));
  }, [appliedQuerry]);

  const applyQuerry = useCallback(debounce(setAppliedQuerry, 1000), []);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuerry = e.target.value;

    setQuery(newQuerry);
    applyQuerry(newQuerry);
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
            {isFocused && people.length === 0
              && <div> No matching suggestions </div>}
            {isFocused && people.length > 0
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
