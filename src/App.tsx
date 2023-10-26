import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './Dropdown';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      return person.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [inputValue]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        isFocused={isFocused}
        inputValue={inputValue}
        filteredPeople={filteredPeople}
        handleInputChange={handleInputChange}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
        handleSuggestionClick={handleSuggestionClick}
      />
    </main>
  );
};
