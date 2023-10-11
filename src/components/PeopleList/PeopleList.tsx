import React from 'react';
import { Person } from '../../types/Person';

type Prop = {
  people: Person[],
  onSelectPerson?: (person: Person) => void,
  onQuery?: (query: string) => void,
};

export const PeopleList:React.FC<Prop> = React.memo(({
  people,
  onSelectPerson = () => {},
  onQuery = () => {},
}) => {
  const handlePersonClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelectPerson(person);
    onQuery(person.name);
  };

  return (
    <>
      {people.map((person: Person) => (
        <div
          className="dropdown-item"
          key={person.slug}
        >
          <a
            href="/"
            className={person.sex === 'f' ? 'has-text-danger' : 'has-text-link'}
            onClick={(event) => handlePersonClick(event, person)}
          >
            {person.name}
          </a>
        </div>
      ))}
    </>
  );
});
