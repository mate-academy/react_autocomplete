import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [visiblePeople, setVisiblePeople] = useState<Person[] | null>(null);
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const isDataAvailable = visiblePeople !== null;
  const [inputValue, setInputValue] = useState('');

  function findName(event: string) {
    const filteredPeople = peopleFromServer
      .filter(person => person.name
        .toLowerCase().includes(event.toLowerCase()));

    setTimeout(() => {
      setVisiblePeople(filteredPeople);
    }, 1000);
  }

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? (`${selectPerson.name} (${selectPerson.born} - ${selectPerson.died}) `)
          : (<p>No person selected</p>)}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={inputValue}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onClick={() => setVisiblePeople([...peopleFromServer])}
            onChange={(event) => {
              findName(event.target.value.trim());
              setInputValue(event.target.value);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {isDataAvailable && (
            visiblePeople?.length > 0 ? (
              <div className="dropdown-content">
                {visiblePeople.map(person => (
                  <button
                    onClick={() => {
                      if (visiblePeople && person) {
                        const selectedPerson = visiblePeople
                          ?.find(user => user.slug === person.slug);

                        setSelectPerson(selectedPerson || null);
                        setVisiblePeople(null);
                        setInputValue(selectedPerson?.name || '');
                      }
                    }}
                    className="dropdown-item"
                    key={person.slug}
                    type="button"
                  >
                    <p
                      className={cn('has-text-link',
                        { 'is-woman': person.sex === 'f' })}
                    >
                      {person.name}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p>Can not find name</p>
            )
          )}
        </div>
      </div>
    </main>
  );
};
