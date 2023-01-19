import { FC } from 'react';
import cn from 'classnames';
import type { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const DropDownItem: FC<Props> = ({ person, onSelect }) => {
  return (
    <div className="dropdown-item">
      <p
        className={cn({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
      >
        <button
          type="button"
          className="selector"
          onClick={() => onSelect(person)}
        >
          {person.name}
        </button>
      </p>
    </div>
  );
};
