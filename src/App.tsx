import { useState } from 'react';
import './App.scss';
import Autocomplete from './components/Autocomplete';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [peoples] = useState(peopleFromServer);
  // const [timeOut, SetTimeOut] = useState(300);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete people={peoples} onSelected={setSelectedPerson} />
      </main>
    </div>
  );
};
//  <Autocomplete people={filteredPeoples} onSelected={handleSelect} />
