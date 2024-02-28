import React, { useState } from 'react';
import classNames from 'classnames';
import { Autocomplete } from './components/Autocomplete';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const people = [...peopleFromServer];
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const getFilteredPeople = (): Person[] => {
    const filteredPeople: Person[] = people.filter(item => {
      return item.name.toLowerCase().includes(appliedQuery.toLocaleLowerCase());
    });

    return filteredPeople;
  };

  const preperedPeople: Person[] = getFilteredPeople();

  const isSelectedPerson = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'No selected person';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {isSelectedPerson}
        </h1>

        <Autocomplete
          delay={1000}
          people={preperedPeople}
          selectedPerson={selectedPerson}
          selectPerson={(currentPerson: Person | null) => {
            setSelectedPerson(currentPerson);
          }}
          aplyQuery={(newQuery: string) => {
            setAppliedQuery(newQuery);
          }}
        />

        <div
          className={classNames(
            'notification is-danger is-light mt-3 is-align-self-flex-start',
            {
              'is-hidden': preperedPeople.length !== 0,
            },
          )}
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </main>
    </div>
  );
};
