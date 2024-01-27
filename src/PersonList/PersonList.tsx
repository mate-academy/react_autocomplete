import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';
import { PersonInfo } from '../PersonInfo/PersonInfo';

type Props = {
  peoples: Person[];
  onSelect?: (person: Person) => void;
  selectedPersonId?: string;
};

export const PersonList: React.FC<Props> = React.memo((({
  peoples,
  onSelect = () => {},
  selectedPersonId,
}) => {
  return (
    <>
      {peoples.map((person: Person) => (
        <div
          role="button"
          tabIndex={0}
          key={person.slug}
          onKeyDown={() => { }}
          className={classNames({
            'has-background-info': selectedPersonId === person.slug,
          })}
          onClick={() => {
            onSelect(person);
          }}
        >
          <PersonInfo
            person={person}
            key={person.slug}
          />
        </div>
      ))}
    </>
  );
}));
