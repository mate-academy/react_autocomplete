import React, { useRef, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [hasInput, setHasInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const people = peopleFromServer.filter(
      a => a.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );

    setFilteredPeople(people);
    setHasInput(true);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setHasInput(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>,
    person: Person) => {
    if (event.key === 'Enter') {
      handleSelect(person);
    }
  };

  const handleTouch = () => {
    setHasInput(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No person selected'}
      </h1>

      <div className={cn('dropdown', { 'is-active': hasInput })}>
        <div className="dropdown-trigger">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleFilter}
            onClick={handleTouch}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.name}
                  onClick={() => handleSelect(person)}
                  onKeyPress={(event) => handleKeyPress(event, person)}
                  role="button"
                  tabIndex={0}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              )))}
          </div>
        </div>
      </div>
    </main>
  );
};
