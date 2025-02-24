import { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  delay?: number;
  people: Person[];
  query: string;
  onSelected: (person: Person) => void;
  onError: (boolean: boolean) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  people,
  query,
  onSelected,
  onError,
}) => {
  const [appliedQuery, setAppliedQuery] = useState(query);

  useEffect(() => {
    const applyQuery = debounce(setAppliedQuery, delay);

    applyQuery(query);
  }, [query]);

  const filteredPeople = [...people].filter(person =>
    person.name.includes(appliedQuery),
  );

  if (filteredPeople.length < 1) {
    onError(true);
  } else {
    onError(false);
  }

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {filteredPeople.map((person: Person) => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.name}
          >
            <p
              className="has-text-link"
              onMouseDown={() => onSelected(person)}
              style={{ pointerEvents: 'auto' }}
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
