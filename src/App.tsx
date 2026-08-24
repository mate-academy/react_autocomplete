import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';
import { useState } from 'react';

let count = 0;

const preparedPeople = peopleFromServer.map(person => {
  const newPerson = {
    id: count,
    ...person,
  };

  count++;

  return newPerson;
});

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleQueryChange = () => {
    setSelectedPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={preparedPeople}
          onSelected={handleSelectedPerson}
          onQueryChange={handleQueryChange}
          delay={300}
        />
      </main>
    </div>
  );
};
