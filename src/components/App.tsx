import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from '../data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from '../types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          value={inputValue}
          onChange={value => {
            setInputValue(value);
            setSelectedPerson(null); // Скидаємо selectedPerson при ручному введенні
          }}
          onSelected={person => {
            setSelectedPerson(person); // Встановлюємо вибрану людину
            setInputValue(person.name); // Оновлюємо input
          }}
        />
      </main>
    </div>
  );
};
