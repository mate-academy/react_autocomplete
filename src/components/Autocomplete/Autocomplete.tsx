import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface AutocompleteProps {
  debounceDelay: number;
  noMatchesMessage: string;
  onSelectPerson: (person: Person) => void;
  people: Person[];
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  debounceDelay,
  noMatchesMessage,
  onSelectPerson,
  people,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropDownActive, setIsDropDownActive] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceDelay),
    [debounceDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
  };

  const handleClick = (person: Person) => {
    onSelectPerson(person);
    setQuery(person.name);
    setIsDropDownActive(false);
  };

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      setIsDropDownActive(false);

      return [];
    }

    setIsDropDownActive(true);

    return people.filter(({
      name,
    }) => name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [people, appliedQuery]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isDropDownActive,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <div className="dropdown-item" key={person.slug}>
                <button
                  type="button"
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={() => handleClick(person)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleClick(person);
                    }
                  }}
                  role="menuitem"
                >
                  {person.name}
                </button>
              </div>
            ))
          ) : (
            <div className="dropdown-item">
              <p className="has-text-danger">{noMatchesMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Autocomplete;
