import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  names: Person[];
  onSelect: (person: Person) => void;
  delay: number;
};

export const Namelist: React.FC<Props>
= React.memo((({ names, onSelect, delay }) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleQueryChange = useCallback(
    debounce(setFilteredPeople, delay), [],
  );

  const handleCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    handleQueryChange(event.target.value);
    setIsFocused(true);
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();

    setQuery(person.name);
    onSelect(person);
    setIsFocused(false);
  };

  const handleFocus = () => {
    if (query === '') {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    if (query === '') {
      setIsFocused(false);
    }
  };

  const currentPeople = useMemo(() => {
    return names.filter(person => (
      person.name.toLowerCase().includes(filteredPeople.toLowerCase())
    ));
  }, [filteredPeople, names]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          onChange={handleCurrentChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isFocused && (
          <div className="dropdown-content">
            {currentPeople.length
              ? currentPeople.map((person) => (
                <div
                  key={person.name}
                  className="dropdown-item"
                >
                  <a
                    href="/"
                    className={classNames('button is-light', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={(event) => handleButtonClick(event, person)}
                  >
                    {person.name}
                  </a>
                </div>
              ))
              : 'No matching suggestions'}
          </div>
        )}
      </div>
    </div>
  );
}));
