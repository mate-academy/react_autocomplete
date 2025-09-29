import './App.scss';
import { peopleFromServer } from './data/people';
import Autocomplete from './Autocomplet';
import { Person } from './types/Person';
import * as React from 'react';

export const App: React.FC = () => {
  const [selected, setSelected] = React.useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title" data-qa="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={ peopleFromServer}
          onSelected={setSelected}
          selected={selected}
          data-cy="autocomplete"
        />
      </main>
    </div>
  );
};