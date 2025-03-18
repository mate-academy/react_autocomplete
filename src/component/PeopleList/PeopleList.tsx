import React from 'react';
import { PeopleInfo } from '../PeopleInfo';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (key: Person) => void;
}

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelected }) => {
    return people.map(person => (
      <PeopleInfo
        key={person.slug}
        name={person.name}
        onSelected={onSelected}
        person={person}
      />
    ));
  },
);

PeopleList.displayName = 'PeopleList';
