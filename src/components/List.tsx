import { FC, memo } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onClick: (person: Person) => void;
};

export const List: FC<Props> = memo(({ people, onClick }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map((person: Person) => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.name}
            onClick={() => onClick(person)}
          >
            <p className="has-text-danger">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
