import React, { useState, useMemo, useCallback } from 'react';
import debounse from 'lodash.debounce';
import { Person } from '../types/Person';

type TypeProps = {
  people: Person[];
  setNewPerson: (person: Person) => void;
  delay?: number;
};

export const Autocomlete: React.FC<TypeProps> = ({
  people,
  setNewPerson,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const applyQuery = useCallback(
    debounse(setAppliedQuery, delay),
    [],
  );

  const visiblePeople = useMemo(() => {
    return people.filter((person) => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [people, appliedQuery]);

  const handleClickByPersonList = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setNewPerson(person);
    setQuery(person.name);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query || appliedQuery) {
      setQuery('');
      setAppliedQuery(event.target.value);
      setTimeout(() => {
        setIsInputFocused(false);
      }, 200);
    } else {
      setTimeout(() => {
        setIsInputFocused(false);
      }, 200);
    }
  };

  return (
    <div
      className="dropdown is-active"
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isInputFocused && (
          <div className="dropdown-content">
            {visiblePeople.length > 0 ? (
              visiblePeople.map((person) => {
                return (
                  <a
                    key={person.name}
                    href="/"
                    className="dropdown-item"
                    onClick={(event) => handleClickByPersonList(event, person)}
                  >
                    {person.name}
                  </a>
                );
              })
            ) : (
              'No matching suggestions.'
            )}
          </div>
        )}
      </div>
    </div>
  );
};
