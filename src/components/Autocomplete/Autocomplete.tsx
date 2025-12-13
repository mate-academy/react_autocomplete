import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debouncedApplyQuery = useMemo(
    () => debounce(setAppliedQuery, delay),
    [delay],
  );

  const visiblePeople = people.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    debouncedApplyQuery(value);
    setSelectedPerson(null);
    onSelect?.(null);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setShowDropdown(false);
    setQuery('');
    onSelect?.(person);
  };

  return (
    <>
      <h1 className="title" data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': showDropdown && visiblePeople.length > 0,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            data-cy="search-input"
            value={query}
            onChange={e => handleInputChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDropdown && visiblePeople.length === 0 && (
        <div
          className="notification
          is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
