import React, { useState } from 'react';
import './App.scss';
// import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Person | null>(null);

  return (
    <main className="section">
      {selectedItem && (
        <h1 className="title">{`${selectedItem.name} (${selectedItem.born} - ${selectedItem.died})`}</h1>
      )}

      <Autocomplete
        delay={1000}
        setSelectedItem={(person) => {
          setSelectedItem(person);
        }}
      />
    </main>
  );
};
