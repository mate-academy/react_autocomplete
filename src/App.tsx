import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { PersonList } from './components/PersonList/PersonList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [isPersonListActive, setIsPersonListActive] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setIsPersonListActive(false);
  };

  const filteredPersons = useMemo(() => {
    setIsPersonListActive(!!appliedQuery);

    if (appliedQuery) {
      setIsPersonListActive(true);
    } else {
      setSelectedPerson(null);
      setIsPersonListActive(false);
    }

    return peopleFromServer.filter(
      person => person.name.toLowerCase()
        .includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery, peopleFromServer]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': isPersonListActive },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <PersonList
              persons={filteredPersons}
              onSelect={handleClick}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
