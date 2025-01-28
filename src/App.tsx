import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Alert } from './components/alert/Alert';
import { Dropdown } from './components/dropdown/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const people = React.useMemo(
    () =>
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [appliedQuery],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          onQueryChange={setAppliedQuery}
          onPersonSelect={setSelectedPerson}
          people={people}
          debounceDelay={300}
        />
        {people.length === 0 && <Alert />}
      </main>
    </div>
  );
};
