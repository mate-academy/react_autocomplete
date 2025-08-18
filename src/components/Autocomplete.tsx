import { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'debounce';

interface Props {
  people: Person[];
  onSelected: (person: Person | undefined) => Person | void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, delay),
    [setAppliedQuery, delay],
  );
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const trimmedValue = newValue.trim();
    setQuery(newValue);
    onSelected(undefined);

    if (trimmedValue === '' || trimmedValue === appliedQuery.trim()) {
      if (trimmedValue === '') {
        setAppliedQuery('');
      }
      return;
    }

    // Apply the trimmed value for searching
    applyQuery(trimmedValue);
  };

  const handleSelectChange = (person: Person) => {
    setQuery(person.name);
    setIsActive(false);
    onSelected(person);
  };

  const filteredPeople = useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [people, appliedQuery],
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
