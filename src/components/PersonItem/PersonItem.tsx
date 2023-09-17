import React from 'react';
import cn from 'classnames';
import { Person, PersonSexEnum } from '../../types/Person';

type Props = {
  person: Person
  handleUserSelect: (person: Person) => void,
};

const PersonItem: React.FC<Props> = ({ person, handleUserSelect }) => {
  const { name, sex } = person;

  const handleClick = () => {
    handleUserSelect(person);
  };

  return (
    <button
      type="button"
      className={
        cn(
          'button',
          'is-info',
          'is-outlined',
          'is-fullwidth',
          'mb-1',
          {
            'has-text-link': sex === PersonSexEnum.man,
            'has-text-danger': sex === PersonSexEnum.female,
          },
        )
      }
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default PersonItem;
