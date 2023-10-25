import classNames from "classnames";
import React from "react";
import { Person } from "../types/Person";

type Props = {
  items: Person[];
  onSelect: (person: Person) => void;
  setQuery: (name: string) => void;
}

export const DropDown: React.FC<Props> = React.memo(({
  items,
  onSelect,
  setQuery,
}) => {

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {items.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            onMouseDown={() => {
              onSelect(person);
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
