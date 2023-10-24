import React from 'react';

import { Person } from '../../types/Person';
import { PersonCard } from '../PersonCard/PersonCard';

type Props = {
  people: Person[],
  setSelectedPerson: (person: Person) => void;
  setShownList: (isShown: boolean) => void;
  setQuery: (newQuery: string) => void;
};

export const PeopleList: React.FC<Props> = React.memo(({
  people,
  setSelectedPerson,
  setShownList,
  setQuery,
}) => {
  return (
    <div className="dropdown-content">
      {people.map(person => (
        <PersonCard
          key={person.slug}
          person={person}
          setSelectedPerson={setSelectedPerson}
          setShownList={setShownList}
          setQuery={setQuery}
        />
      ))}
    </div>
  );
});
