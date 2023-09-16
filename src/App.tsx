import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

const SEARCH_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className={classNames({ title: selectedPerson })}>
        {selectedPerson
          ? (
            `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          ) : (
            'No selected person'
          )}
      </h1>

      <Dropdown
        people={peopleFromServer}
        searchDelay={SEARCH_DELAY}
        onSelected={setSelectedPerson}
      />

    </main>
  );
};
