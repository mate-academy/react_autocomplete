import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
  const [appliedInput, setAppliedInput] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const [isSelected, setIsSelected] = useState(false);
  const { name, born, died } = selectedPerson;

  const timerId = useRef(0);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => person
      .name.toLowerCase().includes(appliedInput.toLowerCase()));
  }, [appliedInput]);

  function debounce(event: React.ChangeEvent<HTMLInputElement>) {
    if (appliedInput !== event.target.value) {
      window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        setAppliedInput(event.target.value);
      }, 500);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);

    debounce(event);
  };

  const handleisSelected = (person: Person) => {
    setSelectedPerson(person);
    setIsSelected(true);
    setInput(person.name);
  };

  function handleEnterKey(e: React.KeyboardEvent<HTMLDivElement>,
    person: Person) {
    if (e.key === 'Enter') {
      handleisSelected(person);
    }
  }

  return (
    <main className="section">
      <h1 className="title">
        {isSelected ? `${name} (${born} = ${died})` : 'No isSelected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={input}
            onChange={handleInputChange}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
        </div>

        {isInputFocused && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.name}
                    onMouseDown={() => handleisSelected(person)}
                    onKeyDown={(e) => handleEnterKey(e, person)}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="has-text-link">
                      {person.name}
                    </p>
                  </div>
                ))
              ) : isInputFocused && (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>

  );
};
