import React from 'react';
import { Person } from '../../types/Person';
import { PostPeople } from '../PostPeople';

type Props = {
  people: Person[];
  selectedBody: (person: Person) => Person | void;
};

export const PostList:React.FC<Props> = React.memo(({
  people,
  selectedBody = () => {},
}) => {
  return (
    <div className="dropdown-content">
      {people.map((person) => (
        <PostPeople
          person={person}
          key={person.slug}
          selectedPerson={selectedBody}
        />
      ))}
      {people.length === 0
      && <p>No matching suggestions</p>}
    </div>
  );
});
