import { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect(person: Person | null): void;
  delay: number
};

export const AutoComplete: React.FC<Props> = ({ people, onSelect, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setIsOpen(true);
    onSelect(null);
  };

  const handlePersonSelect = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setIsOpen(false);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(e) => handleQueryChange(e)}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          {!filteredPeople.length ? (
            <p>No matching suggestions</p>
          ) : (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => handlePersonSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
