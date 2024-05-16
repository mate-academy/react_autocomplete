import debounce from 'lodash.debounce';
import { useCallback, useState, useMemo } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';

interface Props {
  peopleFromServer: Person[];
  onSelected: (person: Person) => void;
  onInputChange: () => void;
}

export const CustomAutocomplete: React.FC<Props> = ({
  peopleFromServer,
  onSelected,
  onInputChange,
}) => {
  const [query, setQuery] = useState('');
  const [dropDown, setDropDown] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), [
    setAppliedQuery,
  ]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setQuery(value);
      applyQuery(value);
      setDropDown(true);
      onInputChange();
    },
    [setQuery, applyQuery, setDropDown, onInputChange],
  );

  const handleSelectPerson = useCallback(
    (person: Person) => {
      setQuery(person?.name);
      setDropDown(false);
      onSelected(person);
    },
    [setQuery, setDropDown, onSelected],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const normalName = person.name.trim().toLowerCase();
      const normalQuery = appliedQuery.trim().toLowerCase();

      return normalName.includes(normalQuery);
    });
  }, [appliedQuery, peopleFromServer]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            setDropDown(true);
          }}
        />
      </div>

      {dropDown && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div
            className={filteredPeople.length !== 0 ? 'dropdown-content' : ''}
          >
            {filteredPeople.length !== 0 ? (
              filteredPeople.map(people => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.slug}
                  onClick={() => handleSelectPerson(people)}
                >
                  <p
                    className={cn('has-text-link', {
                      'has-text-danger': people.sex === 'f',
                    })}
                  >
                    {people.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
