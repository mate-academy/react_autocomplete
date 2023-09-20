import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropdownInput } from './components/DropdownInput/DropdownInput';
import { DropdownList } from './components/DropdownList/DropdownList';
import { DropdownTitle } from './components/DropdownTitle';

export const App: React.FC = () => {
  const [visiblePeople, setVisiblePeople]
    = useState<Person[] | null | [] | Person>(null);
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');

  // eslint-disable-next-line no-console
  console.log(visiblePeople);

  return (
    <main className="section">
      <DropdownTitle
        selectPerson={selectPerson}
      />

      <div className="dropdown is-active">
        <DropdownInput
          inputValue={inputValue}
          setVisiblePeople={setVisiblePeople}
          setInputValue={setInputValue}
        />

        <DropdownList
          visiblePeople={visiblePeople as Person[]}
          setVisiblePeople={setVisiblePeople}
          setSelectPerson={setSelectPerson}
          setInputValue={setInputValue}
        />
      </div>
    </main>
  );
};
