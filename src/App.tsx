import { useState } from 'react';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { peopleFromServer } from './data/people';
// import { Autocomplete } from './components/Autocomplete';

interface Person {
  name: string;
  born: number;
  died: number;
}

export const App = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? (
            `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          ) : (
            <p className="has-text-danger">No selected person</p>
          )}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
          delay={300}
        />
      </main>
    </div>
  );
};
