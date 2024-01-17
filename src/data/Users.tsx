import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface Props {
  filteredPeople: Person[];
  setSelectedPerson: (person: Person) => void
  setQuery: (value: string) => void;
  setApliedQuery: (value: string) => void;
  handleOnClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void;
}

const Users: React.FC<Props> = ({
  filteredPeople,
  setSelectedPerson,
  setQuery,
  handleOnClick,
  setApliedQuery,
}) => (
  <>
    {filteredPeople.map(person => (
      <a
        href="/"
        className="dropdown-item"
        key={person.slug}
        onClick={event => {
          setSelectedPerson(person);
          setQuery(person.name);
          setApliedQuery(person.name);
          handleOnClick(event);
        }}
      >
        <p
          className={classNames(person.sex === 'm'
            ? 'has-text-link'
            : 'has-text-danger')}
        >
          {person.name}
        </p>
      </a>
    ))}
  </>
);

export default Users;
