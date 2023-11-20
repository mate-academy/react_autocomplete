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
  let blurTimeout: ReturnType<typeof setTimeout>;

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

  const handleOnBlurInput = () => {
    blurTimeout = setTimeout(() => {
      setIsShown(false);
    }, 200);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    applyQuery(newQuery);
    setIsShown(!!newQuery.length);
  };

  const handleSelectPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    onSelected(person);
    setIsShown(false);
    clearTimeout(blurTimeout);
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
            onBlur={handleOnBlurInput}
            value={query}
          />
        </div>
        {isShown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {(!filteredPeople.length) ? (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              ) : (
                filteredPeople.map((person: Person) => (
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
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
