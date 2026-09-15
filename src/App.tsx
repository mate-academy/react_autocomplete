import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];

  const [peopleList, setPeopleList] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const queryChangeHandler = (query: string) => {
    if (query.trim() === '') {
      setPeopleList(peopleFromServer);
      setIsMessageVisible(false);
    } else {
      const filteredPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setPeopleList(filteredPeople);

      setIsMessageVisible(filteredPeople.length === 0);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleList}
          delay={300}
          queryChangeHandler={queryChangeHandler}
          onSelected={setSelectedPerson}
        />
        {isMessageVisible && (
          <div
            className={classNames(
              'notification',
              'is-danger',
              'is-light',
              'mt-3',
              'is-align-self-flex-start',
            )}
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
