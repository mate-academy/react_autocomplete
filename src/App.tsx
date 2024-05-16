import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { CustomAutocomplete } from './components/autocomplete';

export const App: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person) => {
    setSuggestions(person);
  };

  const handleInputChange = () => {
    setSuggestions(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title" key={suggestions?.slug}>
          {suggestions
            ? `${suggestions.name} (${suggestions.born} - ${suggestions.died})`
            : 'No selected person'}
        </h1>
        <CustomAutocomplete
          peopleFromServer={peopleFromServer}
          onSelected={handleSelectedPerson}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};
