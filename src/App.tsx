import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { debounce } from './debouce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(peopleFromServer);
  const [chosenPerson, setChosenPerson] = useState<Person | null>();

  const handleInputChangeDebounced = debounce((input: string) => {
    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(input.trim().toLowerCase())
    );
    setFilteredPeople(filtered);
  }, 300);

  const handleInputChange = (input: string) => {
    setQuery(input);
    setChosenPerson(null);
    handleInputChangeDebounced(input);
  };

  const handlePersonSelection = (person: Person) => {
    setChosenPerson(person);
  };

  return (
    <div>
      <main className="section">
        {chosenPerson ? (
          <h1 className="title">
            {`${chosenPerson.name} (${chosenPerson.born} - ${chosenPerson.died})`}
          </h1>
      ) : (
          <h1 className="title">
            {`${name} (${born} - ${died})`}
          </h1>)}
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </div>
          {!chosenPerson ? (
            <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length === 0 ? (
                <div className="dropdown-item">'No matching suggestions'</div>
              ) : (
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                    onClick={() => handlePersonSelection(person)}
                  >
                    <a
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
          ) : null
        }
        </div>
      </main>
    </div>
  );
};
