/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import cn from 'classnames';
import './Autocomplete.scss';
import { Person } from '../types/Person';
import { useCallback, useState } from 'react';

type Props = {
  filteredPeople: Person[];
  onAppliedSearch: (value: string) => void;
  onSelected: (value: Person | null) => void;
};

function debounce(callback: Function, delay = 300) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  filteredPeople,
  onAppliedSearch,
  onSelected,
}) => {
  const [search, setSearch] = useState('');

  const [isActive, setIsActive] = useState(false);

  const applySearch = useCallback(debounce(onAppliedSearch, 1000), []);

  const handleSearchOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value.trimStart());
    applySearch(event.target.value.trimStart());
    onSelected(null);
  };

  const handleOnSelected = (person: Person) => {
    onSelected(person);
    setIsActive(false);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={search}
          onChange={handleSearchOnChange}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length > 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handleOnSelected(person)}
              >
                <p
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
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
