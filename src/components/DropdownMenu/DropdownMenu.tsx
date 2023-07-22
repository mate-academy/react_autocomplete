// import { ReactHTMLElement } from 'react';
import React from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  // selectedPersonId?: string;
  // setSelectedPerson?: (person: Person) => void;
  // handleSelectedPerson: (id: string) => void;
  handleSelectedPerson: (person: Person) => void;
  // setIsSelected: () => {};
  // delay: number;
  // setDelay: (time: number) => void;
};

export const DropdownMenu: React.FC<Props> = ({
  people,
  handleSelectedPerson,
  // selectedPersonId,
  // onSelect = () => {},
}) => {
  // setDelay(2000);
  // const handleClick = (event: ReactHTMLElement<cli>) =>
  console.log('dd render');

  return (
    <div className="dropdown-menu" role="menu">
      <ul className="dropdown-content">
        {people.length ? people.map((person, index) => (
          <li
            key={person.slug}
            className="dropdown-item"
          >
            <a
              role='button'
              tabIndex={index}
              className={
                classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                }
              )}
              onClick={() => {
                handleSelectedPerson(person);
              }}
              onKeyDown={(event) => {
                if(event.key === 'Enter') {
                  handleSelectedPerson(person);
                }
              }}
            >
              {person.name}
            </a>
          </li>
        )) : <li className="dropdown-item">No matching suggestions</li>}
      </ul>
    </div>
  );
};
