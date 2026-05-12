import { useState } from 'react';
import { Autocomplete } from './components/Autocomplete';
import { Nullable } from './types/Nullable';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import './App.scss';

export const App = () => {
  const [selectedPerson, setSelectedPerson] = useState<Nullable<Person>>(null);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPerson}
        />
      </main>
    </div>
  );
};
