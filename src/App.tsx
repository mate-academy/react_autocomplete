import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, onSelected] = useState<Person | null>(null);
  const [value, setValue] = useState('');

  if (selected && value.trim() !== selected.name.trim()) {
    onSelected(null);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected && value.trim() === selected.name.trim()
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          peopleFromServer={peopleFromServer}
          onSelected={prev => onSelected(prev)}
          setNewValue={prev => setValue(prev)}
          newValue={value}
          selected={selected}
          delay={300}
        />
      </main>
    </div>
  );
};
