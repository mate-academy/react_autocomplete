import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person,
  onSelect: (person: Person) => void,
  onQuery: () => void,
};

export const DropDownItem: React.FC<Props> = ({
  person,
  onSelect,
  onQuery,
}) => {
  return (
    <div className="dropdown-item">
      <p>
        <a
          href="#item"
          className={classNames({
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
          onClick={(e) => {
            e.preventDefault();
            onSelect(person);
            onQuery();
          }}
        >
          {person.name}
        </a>
      </p>
    </div>
  );
};
