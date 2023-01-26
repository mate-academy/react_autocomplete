import cn from 'classnames';
import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);

  const people = peopleFromServer.filter(
    person => person.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const { name, born, died } = selectedPerson;

  return (
    <main className="section">
      {isMenuVisible
        ? (
          <h1 className="title">
            No selected person
          </h1>
        ) : (
          <h1 className="title">
            {`${name} (${born} = ${died})`}
          </h1>
        )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setIsMenuVisible(true)}
            value={searchText}
            onChange={event => {
              setSearchText(event.target.value);
            }}
          />
        </div>

        {isMenuVisible && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {people.length
                ? (
                  people.map(person => (
                    <div className="dropdown-item">
                      <p // eslint-disable-line
                        key={person.slug}
                        className={cn(
                          { 'has-text-link': person.sex === 'm' },
                          { 'has-text-danger': person.sex === 'f' },
                        )}
                        onClick={(event) => {
                          const input = event.target as HTMLElement;

                          setSearchText(input.innerHTML);
                          setSelectedPerson(person);
                          setIsMenuVisible(false);
                        }}
                      >
                        {person.name}
                      </p>
                    </div>
                  ))
                ) : (
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
