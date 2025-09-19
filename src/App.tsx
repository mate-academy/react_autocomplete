import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/DropdownList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const [inputValue, setInputValue] = useState<string>('');
  const [people] = useState(peopleFromServer);
  const [delay] = useState(300);

  const suggestedPeople = useMemo(() => {
    if (/\s{2,}/.test(inputValue)) {
      return [];
    }

    return people.filter((person: Person) => {
      return person.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [people, inputValue]);

  const onSelected = (person: Person) => {
    setSelectedPerson(person);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title">
          {selectedPerson
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>

        <DropdownList
          people={suggestedPeople}
          onSelected={onSelected}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          delay={delay}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </main>
    </div>
  );
};
