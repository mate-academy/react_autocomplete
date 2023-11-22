// import { useRef } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[]
  onSelected: (person: Person) => void
};

export const DropdownContent: React.FC<Props> = ({
  people,
  onSelected,
}) => {
  // const selectedPerson = useRef<HTMLInputElement | null>(null);

  return (
    <div className="dropdown-content">
      { people.length
        ? people.map(person => (
          <div
            className="dropdown-item"
            key={person.name}
          >
            <p
              className="has-text-link"
              role="presentation"
              // ref={selectedPerson}
              onClick={() => onSelected(person)}
            >
              {person.name}
            </p>
          </div>
        ))
        : 'No matching suggestions'}
    </div>
  );
};
