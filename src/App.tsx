import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropdownInput } from './components/DropdownInput/DropdownInput';
import { DropdownList } from './components/DropdownList/DropdownList';

export const App: React.FC = () => {
  const [visiblePeople, setVisiblePeople] = useState<Person[] | []>([]);
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <main className="section">
      <h1 className="title">
        {selectPerson
          ? (`${selectPerson.name} (${selectPerson.born} - ${selectPerson.died}) `)
          : (<p>No person selected</p>)}
      </h1>

      <div className="dropdown is-active">
        <DropdownInput
          inputValue={inputValue}
          setVisiblePeople={setVisiblePeople}
          setInputValue={setInputValue}
        />

        <DropdownList
          visiblePeople={visiblePeople}
          setSelectPerson={setSelectPerson}
          setVisiblePeople={setVisiblePeople}
          setInputValue={setInputValue}
        />
      </div>
    </main>
  );
};
