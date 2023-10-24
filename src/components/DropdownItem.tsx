import React from 'react';
import classnames from 'classnames';
import { Person, PersonSex } from '../types/Person';

type Props = {
  person: Person
  onSelect: (userId: string) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => {
  const { slug, sex, name } = person;

  return (
    <button
      type="button"
      className="button is-fullwidth is-justify-content-flex-start"
      onClick={() => onSelect(slug)}
    >
      <p className={classnames({
        'has-text-link': sex === PersonSex.Male,
        'has-text-danger': sex === PersonSex.Female,
      })}
      >
        {name}
      </p>
    </button>
  );
};
