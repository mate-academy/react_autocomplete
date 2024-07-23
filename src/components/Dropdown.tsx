import { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';
import debounce from 'lodash.debounce';
import cn from 'classnames';

type Props = {
  setSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({ setSelected, delay }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(true);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useMemo(
    () =>
      debounce(value => {
        setAppliedQuery(value);
      }, delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsDropdownActive(true);
    setSelected(null);

    applyQuery(event.target.value);
  };

  const handleClick = (person: Person) => {
    setSelected(person);
    setIsDropdownActive(false);
    setQuery(person.name);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(peop =>
      peop.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleFocus = () => {
    setIsDropdownActive(true);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isDropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onBlur={() => setIsDropdownActive(false)}
          onFocus={handleFocus}
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filterPeople.length ? (
              filterPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                >
                  <p
                    className="has-text-link"
                    onMouseDown={() => handleClick(person)}
                  >
                    {person.name}
                  </p>
                </div>
              ))
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
      )}
    </div>
  );
};
