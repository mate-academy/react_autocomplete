import './App.scss';
import React from 'react';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  return (
    <main className="section is-flex is-flex-direction-column">
      <Autocomplete
        people={peopleFromServer}
        delay={1000}
      />
    </main>
  );
};
