import React, { useState } from 'react';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

import './App.scss';

export const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedItem
            ? `${selectedItem.name} (${selectedItem.born} - ${selectedItem.died})`
            : 'No selected person'
        }
      </h1>

      <Autocomplete
        items={[...peopleFromServer]}
        selectedItem={selectedItem}
        onSelected={setSelectedItem}
        delay={1000}
      />
    </main>
  );
};
