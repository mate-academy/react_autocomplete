import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

import Autocomplete from './components/Autocomplete';

export const App: React.FC = () => {
  return (
    <main className="section">
      <Autocomplete peopleFromServer={peopleFromServer} debounceDelay={1000} />
    </main>
  );
};
