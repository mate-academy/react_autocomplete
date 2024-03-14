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
  const DELAY = 300;
  const [onSelected, setOnSelected] = useState(notSelectedPerson);
  const { name, born, died } = onSelected;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {name === '' ? 'No selected person' : `${name} (${born} - ${died})`}
        </h1>
        <Autocomplete
          delay={DELAY}
          onSelected={onSelected}
          notSelectedPerson={notSelectedPerson}
          rewriteOnSelected={setOnSelected}
        />
      </main>
    </div>
  );
};
