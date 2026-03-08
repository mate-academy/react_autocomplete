import React from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  return (
    <div className="container">
      <main className="section">
        <Autocomplete data={peopleFromServer} delay={300} />
      </main>
    </div>
  );
};
