import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounse(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const delay = 300;
  const clearPerson = {
    name: '',
    born: 0,
    died: 0,
  };
  const [people] = useState(peopleFromServer);
  const [searchPeople, setSearchPeople] = useState('');
  const [apliedPeople, setApliedPeople] = useState('');
  const [usePeople, setUsePeople] = useState(false);
  const [activePerson, setActivePerson] = useState(clearPerson);
  const { name, born, died } = activePerson;
  const handleUsePeople = () => {
    setUsePeople(true);
  };

  const handleClickUser = (person: Person) => {
    setUsePeople(false);
    setSearchPeople(person.name);
    setApliedPeople(person.name);
    setActivePerson({
      name: person.name,
      born: person.born,
      died: person.died,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyPeople = useCallback(debounse(setApliedPeople, delay), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPeople(e.target.value);
    applyPeople(e.target.value);

    if (e.target.value !== name) {
      setActivePerson(clearPerson);
    }
  };

  const peopleFilter = useMemo(() => {
    return people.filter(it =>
      it.name.toLowerCase().includes(apliedPeople.toLowerCase()),
    );
  }, [people, apliedPeople]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {name ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <Autocomplete
          searchPeople={searchPeople}
          handleSearchChange={handleSearchChange}
          handleUsePeople={handleUsePeople}
          usePeople={usePeople}
          peopleFilter={peopleFilter}
          handleClickUser={handleClickUser}
        />
      </main>
    </div>
  );
};
