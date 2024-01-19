import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplite';
import { Title } from './components/Title';

export const App: React.FC = () => {
  return (
    <main className="section">
      <Title />

      <Autocomplete data={peopleFromServer} />
    </main>
  );
};
