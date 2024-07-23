import { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Persons } from './Person';

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

  const handleBlur = () => {
    if (isDropdownActive) {
      setIsDropdownActive(false);
    }
  };

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
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </div>

      {isDropdownActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <Persons handleClicks={handleClick} appliedQuery={appliedQuery} />
        </div>
      )}
    </div>
  );
};
