import React, { useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Notification } from './components/Notification/Notification';
import { Title } from './components/Title/Title';
import { Person } from './types/Person';

const DELAY = 300;

export const App = () => {
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState(peopleFromServer);
  const [select, setSelect] = useState<Person | null>(null);
  const timerId = useRef(0);
  const controlQuery = useRef(query);

  const filteredPeople = (value: string) => {
    if (controlQuery.current === value) {
      return;
    }

    const normalizeQuery = value.toLowerCase().trim();

    if (normalizeQuery === '') {
      setPeople(peopleFromServer);

      return;
    }

    controlQuery.current = value;
    setPeople(() => {
      return peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalizeQuery),
      );
    });
  };

  const handleOnSelectPerson = (person: Person) => {
    setSelect(person);
    setQuery(person.name);
  };

  const saveQuery = (newValue: string, delay = 300) => {
    clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      filteredPeople(newValue);
    }, delay);
  };

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    delay?: number,
  ) => {
    const newValue = event.target.value;

    setSelect(null);
    setQuery(newValue);
    saveQuery(newValue, delay);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Title user={select} />
        <Dropdown
          users={people}
          handleOnChange={handleOnChange}
          query={query}
          onSelectPerson={handleOnSelectPerson}
          delay={DELAY}
        />

        {people.length === 0 && <Notification />}
      </main>
    </div>
  );
};
