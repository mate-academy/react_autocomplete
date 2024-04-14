import { useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

interface Props {
  people: Person;
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>;
}

export const DropdownInfo: React.FC<Props> = ({ people, setPerson }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={classNames('dropdown-item', {
        'has-background-info-light': isHovered,
      })}
      data-cy="suggestion-item"
      onMouseDown={() => setPerson(people)}
      key={people.name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="has-text-link">{people.name}</p>
    </div>
  );
};
