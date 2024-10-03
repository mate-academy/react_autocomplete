import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${name} (${born} - ${died})`}
        </h1>
        <Autocomplete />
      </main>
    </div>
  );
};
