import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, onSelected] = useState<Person | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (selected?.name.trim() !== value.trim()) {
      onSelected(null);
    }
  }, [value]);

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
          onNewSelected={prev => onSelected(prev)}
          setNewValue={prev => setValue(prev)}
          newValue={value}
          delay={300}
        />
      </main>
    </div>
  );
};
