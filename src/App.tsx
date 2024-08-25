import React, { useState } from 'react';
import './App.scss';

import { Autocomplete } from './Autocomplete';
import { Title } from './components/Title';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [person, setPerson] = useState<Person>();

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {<Title person={person} text={'No selected person'} />}
        <Autocomplete setPersonForTitle={setPerson} people={people} />
      </main>
    </div>
  );
};
