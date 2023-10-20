import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [inputFocus, setInputFocus] = useState(false);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const personInfo =`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`;

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    delay: number) => {
      setQuery(event.target.value);

      setTimeout(() => {
        setAppliedQuery(event.target.value)
      }, delay)
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const name = person.name.toLowerCase();
      const lowerQuery = appliedQuery.toLowerCase().trim();

      return name.includes(lowerQuery);
    })
  }, [appliedQuery]);

  const onSelected = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    person: Person) => {
      event.preventDefault();
      setSelectedPerson(person);
      setAppliedQuery(person.name);
      setQuery(person.name)
  }

  return (
    <main className="section">
      {selectedPerson
        ? <h1 className="title">{personInfo}</h1>
        : <h1 className="title">No person is selected</h1>}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => handleQueryChange(event, 1000)}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
          />
        </div>

        {inputFocus &&
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length === 0
                ? (
                  <div className="dropdown-item">
                    <p>No selected person</p>
                  </div>
                )
                : (filteredPeople.map(person => (
                  <div className="dropdown-item">
                    <p
                      className={person.sex === 'f' ? 'has-text-danger' : 'has-text-link'}
                      style={{ cursor: 'pointer' }}
                      onMouseDown={(event) => onSelected(event, person)}
                    >
                      {person.name}
                    </p>
                  </div>
                )))}
            </div>
          </div>}
      </div>
    </main>
  );
};
