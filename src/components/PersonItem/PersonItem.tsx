import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

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
            'has-text-link': sex === 'm',
            'has-text-danger': sex === 'f',
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
