import React, { useState } from 'react';
import './App.scss';
// Імпортуємо тип Person, щоб React знав структуру об'єкта людини
import { Person } from './types/Person';
// Імпортуємо наш новий розумний компонент автозаповнення
import Autocomplete from './components/Autocomplete';

export const App: React.FC = () => {
  // Цей стан зберігає інформацію про людину, яку користувач обрав у списку.
  // Початкове значення — null, бо спочатку ніхто не обраний.
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {/*
          Головний заголовок додатка.
          Якщо selectedPerson дорівнює null (пусто), виводимо текст 'No selected person'.
          Якщо людину обрано, виводимо її ім'я, рік народження та рік смерті.
        */}
        <h1 className="title" data-cy="title">
          {!selectedPerson
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        {/*
          Викликаємо наш компонент Autocomplete.
          Передаємо йому функцію setSelectedPerson як колбек.
          Коли всередині Autocomplete користувач клікне на людину,
          цей колбек спрацює і оновить стан selectedPerson тут, у компоненті App.
        */}
        <Autocomplete onSelected={setSelectedPerson} />
      </main>
    </div>
  );
};
