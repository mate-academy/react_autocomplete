import cn from 'classnames';
import debounce from 'lodash.debounce';
import {
  FC, useCallback, useMemo, useState,
} from 'react';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

const toNormalizeQuery = (query: string) => query.trim().toLocaleLowerCase();

type DropdownProps = {
  onSelected: (person: Person) => void;
  delay: number;
};

export const Dropdown: FC<DropdownProps> = ({ onSelected, delay }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const showFullList = () => !searchQuery && setIsDropdownOpen(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applySearchFilter = useCallback(
    debounce((value: string) => setFilterQuery(value), delay),
    [setFilterQuery, delay],
  );

  const filteredPeople = useMemo(() => {
    // eslint-disable-next-line max-len
    return peopleFromServer.filter((person: Person) => person.name.toLowerCase().includes(toNormalizeQuery(filterQuery)));
  }, [filterQuery]);

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
    applySearchFilter(event.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setSearchQuery(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchQuery || filterQuery) {
      setSearchQuery('');
      setFilterQuery(event.target.value);
      applySearchFilter('');
      setTimeout(() => {
        setIsDropdownOpen(false);
      }, delay / 2);
    } else {
      setTimeout(() => {
        setIsDropdownOpen(false);
      }, delay / 2);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onFocus={showFullList}
          onBlur={handleBlur}
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filteredPeople.length ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredPeople.map((person) => (
                <a
                  key={person.name}
                  href="/"
                  className={cn('dropdown-item', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={(event) => handleSelectedPerson(event, person)}
                >
                  {person.name}
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
