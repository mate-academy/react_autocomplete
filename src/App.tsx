import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectSuggestion, setSelectSuggestion] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectSuggestion
            ? `${selectSuggestion.name} (${selectSuggestion.born} - ${selectSuggestion.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectSuggestion}
          delay={300}
        />
      </main>
    </div>
  );
};
