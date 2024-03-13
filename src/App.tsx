import { useState } from 'react';
import './App.scss';
import { Person } from './types/Person';

import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const notSelectedPerson: Person = {
    name: '',
    sex: 'm',
    born: 0,
    died: 0,
    fatherName: '',
    motherName: '',
    slug: '',
  };
  const [delay] = useState<number>(300);
  const [onSelected, setOnSelected] = useState(notSelectedPerson);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Autocomplete
          delay={delay}
          onSelected={onSelected}
          notSelectedPerson={notSelectedPerson}
          rewriteOnSelected={setOnSelected}
        />
      </main>
    </div>
  );
};
