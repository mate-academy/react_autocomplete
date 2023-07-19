import React, { useMemo, useState } from 'react';

import './App.scss';
import { Dropdown } from './components';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [onSelected, setOnSelected] = useState<Person | null>(null);

  const selectedPerson = useMemo(() => {
    if (onSelected) {
      const { name, born, died } = onSelected;

      return `${name} (${born} - ${died})`;
    }

    return 'No selected person';
  }, [onSelected]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson}
      </h1>

      <Dropdown
        people={peopleFromServer}
        setOnSelected={setOnSelected}
        delay={1000}
      />
    </main>
  );
};
