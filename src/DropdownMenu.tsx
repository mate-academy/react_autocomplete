import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';

interface Props {
  people: Person[],
  onSelected: (person: Person) => void
  delay: number
}

export const DropdownMenu: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShown, setIsShown] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay), [],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [appliedQuery, people]);
  const handleOnFocus = () => {
    if (query === '') {
      setIsShown(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsShown(true);
  };

  const handleSelectPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    onSelected(person);
    setIsShown(false);
  };

  return (
    <div>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            value={query}
          />
        </div>
        {isShown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {(filteredPeople.length === 0) && (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.name}
                >
                  <a
                    href="/"
                    className={classNames('button is-light', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={(event) => handleSelectPerson(event, person)}
                  >
                    {person.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
