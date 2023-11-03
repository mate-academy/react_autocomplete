import { useState, FC } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';

export const App: FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();

  const personInfo = `${selectedPerson?.name}
   (${selectedPerson?.born}
     =
    ${selectedPerson?.died})`;

  return (
    <main className="section">
      {selectedPerson
        ? <h1 className="title">{personInfo}</h1>
        : <h1 className="title">No selected person</h1>}
      <Dropdown setSelectedPerson={setSelectedPerson} delayTime={1000} />
    </main>
  );
};
