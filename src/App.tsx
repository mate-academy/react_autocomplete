import React, { useCallback, useState } from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

const filterPeopleByName = (
  items: Person[],
  query: string,
): Person[] => {
  const formatedQuery = query.toLowerCase().trim();

  return items.filter((item) =>
    item.name
      .toLocaleLowerCase()
      .includes(formatedQuery));
}

export const App: React.FC = () => {
  // #region state
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  // #endregion

  // #region handle
  // #endregion

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        items={peopleFromServer}
        filtrationDelay={1000}
        filterFn={filterPeopleByName}
        onSelected={useCallback(
          (person: Person | null) => {
            setSelectedPerson(person);
            return person?.name;
          }, [],)}
      />
    </main>
  );
};
