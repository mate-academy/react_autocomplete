import './App.scss';
import { Dropdown } from './components/dropdown_menu/Dropdown-menu';
import { Person } from './types/Person';
import { useState } from 'react';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>
        <Dropdown
          delay={300}
          onSelected={setSelectedPerson}
          selectedPerson={selectedPerson}
        />
      </main>
    </div>
  );
};
