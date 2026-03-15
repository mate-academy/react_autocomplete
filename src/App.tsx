import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { UserSelect } from './components/UserSelect';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  const handleSelect = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <UserSelect people={peopleFromServer} onSelect={handleSelect} />
      </main>
    </div>
  );
};
