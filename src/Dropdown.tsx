import { useCallback, useMemo, useState } from 'react';
import { Person } from './types/Person';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

const DELAY = 3000;

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelect,
  delay = DELAY,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListShown, setisListShown] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);
    onSelect(null);
  };

  const handleSelectPerson = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setisListShown(false);
  };

  const filteredPeople = useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      ),
    [appliedQuery, people],
  );

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isListShown,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setisListShown(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.name}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelectPerson(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}

          {filteredPeople.length === 0 && (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
