import React, { useState, useCallback, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const debounce = (f: (args: string) => void, delay: number) => {
  let timerId: NodeJS.Timeout;

  return (args: string) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelctedPerson] = useState<null | Person>(null);
  const [message, setMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const aplyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const onSelected = useMemo(() => (person: Person) => {
    setSelctedPerson(person);
    setIsOpen(false);
  }, []);

  useMemo(() => {
    let people: Person[] = [];

    if (appliedQuery) {
      people = peopleFromServer
        .filter(person => person.name.toLowerCase()
          .includes(appliedQuery.toLowerCase()));
    }

    if (people.length > 0) {
      setMessage('');
      setFilteredPeople(people);
      setIsOpen(true);
    } else {
      setMessage('No matching suggestions');
      setFilteredPeople([]);
      setIsOpen(false);
    }
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No selected person')}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              aplyQuery(event.target.value);
            }}
          />
        </div>

        {isOpen
          && (
            <div className="dropdown-menu" role="menu">
              {filteredPeople?.map((person) => (
                <div className="dropdown-item" key={person.slug}>
                  <div
                    className={person.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
                    onClick={() => onSelected(person)}
                    style={{ cursor: 'pointer' }}
                  >
                    {person.name}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {(message && appliedQuery)
        && (
          <div className="
          notification
          is-danger
          is-light
          has-text-weight-normal"
          >
            {message}
          </div>
        )}
    </main>
  );
};
