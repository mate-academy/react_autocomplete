import React, {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
} from 'react';
import { Person } from '../types/Person';

type Props = {
  setSelectedPerson: (person: Person) => void;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  visiblePersones: Person[] | null;
};

export const DropdownMenu: FC<Props> = ({
  setSelectedPerson,
  setShowSuggestions,
  visiblePersones,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {visiblePersones?.map((person) => (
          <a
            href={`#${person.name}`}
            className="dropdown-item"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
              setSelectedPerson(person);
              setShowSuggestions(false);
            }}
          >
            <p className="has-text-link">{person.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
