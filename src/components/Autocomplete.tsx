import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'debounce';

interface Props {
  people: Person[];
  onSelect: (person: Person | undefined) => Person | void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({ people, onSelect, delay }) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [aplliedQuery, setAppliedQuery] = useState<string>('');
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);
  console.log('Component re-rendering');
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(undefined);
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSelectChange = (person: Person) => {
    setQuery(person.name);
    setIsActive(false);
    onSelect(person);
  };

  const filteredPeople = useMemo(
    () =>
      people.filter(person => {
        console.log(`Filtering check`);
        return person.name.toLowerCase().includes(aplliedQuery.toLowerCase());
      }),
    [people, aplliedQuery],
  );

  return (
    <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length !== 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => {
                  console.log('Element clicked!');
                  handleSelectChange(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
