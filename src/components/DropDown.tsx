import classNames from "classnames";
import React from "react";
import { Person } from "../types/Person";

type Props = {
  filteredPeople: Person[];
  setSelectedPerson: (person: Person) => void;
  setQuery: (name: string) => void;
}

export const DropDown: React.FC<Props> = React.memo(({
  filteredPeople,
  setSelectedPerson,
  setQuery,
}) => {
  console.log('render');

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {filteredPeople.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            onMouseDown={() => {
              setSelectedPerson(person);
              setQuery(person.name)
            }}
          >
            <p className={classNames({
              'has-text-info': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}>
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});
