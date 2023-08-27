import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [onSelected, setOnSelected] = useState<Person | null>(null);

  const handleSelect = (person: Person) => {
    setOnSelected(person);
  };

  const onDelete = () => {
    setOnSelected(null);
  };

  return (
    <main className="section">
      <h1 className="title">
        {onSelected
          ? (`${onSelected.name} (${onSelected.born} = ${onSelected.died})`)
          : ('No matching suggestions')}
      </h1>

      <Dropdown persons={peopleFromServer} handleSelect={handleSelect} />
      {onSelected && (
        <button
          className="delete is-large"
          type='reset'
          onClick={onDelete}
        />
      )}
    </main>
  );
};
