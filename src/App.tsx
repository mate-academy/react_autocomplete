import React, { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropdownInput } from './components/DropdownInput/DropdownInput';
import { DropdownList } from './components/DropdownList/DropdownList';
import { DropdownTitle } from './components/DropdownTitle';

export const App: React.FC = () => {
  const [visiblePeople, setVisiblePeople]
    = useState<Person[] | null | [] | Person>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <main className="section">
      <DropdownTitle selectPerson={selectedPerson} />

      <div className="dropdown is-active">
        <DropdownInput
          inputValue={inputValue}
          setVisiblePeople={setVisiblePeople}
          setInputValue={setInputValue}
        />

        <DropdownList
          visiblePeople={visiblePeople as Person[]}
          setVisiblePeople={setVisiblePeople}
          setSelectPerson={setSelectedPerson}
          setInputValue={setInputValue}
        />
      </div>
    </main>
  );
};
