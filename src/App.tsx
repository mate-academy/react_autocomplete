import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import 'bulma/css/bulma.css';
import './App.scss';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { peopleFromServer } from './data/people';
import { getPeopleByName } from './services/getPeopleByName';

// const debouncedFilterPeople = debounce(
//   (name: string, setPeople: React.Dispatch<React.SetStateAction<Person[]>>) => {
//     setPeople(getPeopleByName(name));
//   }, 1000,
// );

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [people, setPeople] = useState<Person[]>(peopleFromServer);

  const handlePerson = useCallback((event: Person) => {
    setSelectedPerson(event);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterPeople = useCallback(
    debounce((name: string) => {
      setPeople(getPeopleByName(name));
    }, 1000),
    [],
  );

  // const filterPeople = useCallback(
  //   (name: string) => {
  //     debouncedFilterPeople(name, setPeople);
  //   },
  //   [],
  // );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : 'Nobody was selected'}
      </h1>

      <Autocomplete
        people={people}
        onSelected={handlePerson}
        filterPeople={filterPeople}
      />
    </main>
  );
};
