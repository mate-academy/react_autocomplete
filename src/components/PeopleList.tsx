import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import './PeopleList.css';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelect = () => { },
}) => (
  <div className="dropdown-item">
    {people.map(person => (
      <button
        className="has-text-link"
        type="submit"
        onMouseDown={() => onSelect(person)}
      >
        <p
          key={person.name}
          className={cn({
            'has-text-danger': person.sex === 'f',
            'has-text-link': person.sex === 'm',
          })}
        >
          {person.name}
        </p>
      </button>
    ))}

    {!people.length && (
      <span className="has-text-danger">
        No matching suggestions
      </span>
    )}
  </div>
);
