import './App.scss';

import React, { useMemo, useState } from 'react';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownMenu } from './Components/DropDownMenu';

export const App: React.FC = () => {
  const [chosenPerson, setChosenPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    const trimmedQuery = appliedQuery.trim();

    if (!trimmedQuery) {
      return peopleFromServer;
    }

    const normalisedQuery = trimmedQuery.toLowerCase();

    return peopleFromServer.filter(person => {
      const normalisedPersonName = person.name.toLowerCase();

      return normalisedPersonName.includes(normalisedQuery);
    });
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {chosenPerson
            ? `${chosenPerson.name} (${chosenPerson.born} - ${chosenPerson.died})`
            : `No selected person`}
        </h1>

        <DropDownMenu
          changeChosenPerson={setChosenPerson}
          changeAppliedQuery={setAppliedQuery}
          people={filteredPeople}
        />
      </main>
    </div>
  );
};
