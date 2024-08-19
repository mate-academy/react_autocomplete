import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Message } from './components/Message';
// import { Person } from './types/Person';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  // const [people, setPeople] = useState<Person[]>(peopleFromServer);
  // const [filteredPerson, setFilteredPerson] = useState<Person[]>([]);
  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);

    // setFilteredPerson()
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={value}
              onChange={handleChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div>
            </div>
          </div>
        </div>

        <Message />
      </main>
    </div>
  );
};
