import React, { useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './Dropdown';
import { Notification } from './Notification';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [partText, setPartText] = useState('');
  const [textChanged, setTextChanged] = useState(false);

  const { name, born, died } = selectedUser || {};
  const personInfo =
    selectedUser && !textChanged
      ? `${name} (${born} - ${died})`
      : 'No selected person';

  const [correctPeople, setCorrectPeople] = useState(peopleFromServer);

  const timerId = useRef(0);

  const queryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartText(event.target.value);
    setTextChanged(true);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setCorrectPeople(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(event.target.value.toLowerCase()),
        ),
      );
    }, 300);
  };

  const onSelect = (person: Person) => {
    setSelectedUser(person);
    setPartText(person.name);
    setTextChanged(false);
  };

  const noSugAlert = partText && !correctPeople.length;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {personInfo}
        </h1>

        <Dropdown
          people={correctPeople}
          queryChange={queryChange}
          partText={partText}
          onSelect={onSelect}
        />
        {noSugAlert && <Notification />}
      </main>
    </div>
  );
};
