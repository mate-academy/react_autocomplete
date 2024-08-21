import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Message } from './components/Message';
import { DropdownItem } from './components/DropdownItem';
import { Title } from './components/Title';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
// import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>(people);
  const [value, setValue] = useState<string>('');
  const [person, setPerson] = useState<Person>();

  const [focus, setFocus] = useState<boolean>(false);

  const appliedFilterPersons = useCallback(
    debounce(setFilteredPersons, 300),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);

    const filterPeople = people.filter(person =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase()),
    );

    appliedFilterPersons(filterPeople);
  };

  const handleSelect = (name: string) => {
    setValue(name);
  };

  useEffect(() => {
    setPerson(people.find(item => item.name === value));
  }, [value]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {person && <Title person={person} />}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={value}
              onChange={handleChange}
              onFocus={() => setFocus(true)}
            />
          </div>

          {focus && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPersons.map(person => (
                  <DropdownItem
                    name={person.name}
                    key={person.name + person.died}
                    onSelected={handleSelect}
                    onFocus={setFocus}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {!filteredPersons.length && <Message />}
      </main>
    </div>
  );
};
