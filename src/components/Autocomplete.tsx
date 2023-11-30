import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface Props {
  personList: Person[];
  onSelect?: (person: Person) => void;
  delay: number;
}

export const Autocomplete: React.FC<Props> = ({
  personList,
  onSelect = () => { },
  delay,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isListHovered, setIsListHovered] = useState(false);

  const applyQuery = useMemo(
    () => debounce(setInputQuery, delay), [delay],
  );
  const selectPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setSelectedPerson(person.name);
    onSelect(person);
    setIsFocused(false);
  };

  const handleBlur = () => (
    isListHovered ? setIsFocused(true) : setIsFocused(false)
  );

  const isDropdownActive = () => {
    setIsFocused(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(e.target.value);
    applyQuery(e.target.value);
  };

  const peopleFilter = useMemo(() => {
    return personList
      .filter(person => person.name.toLocaleLowerCase()
        .includes(inputQuery.toLocaleLowerCase()));
  }, [inputQuery, personList]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger ">
        <input
          type="text"
          value={selectedPerson}
          aria-haspopup="true"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          onFocus={isDropdownActive}
          onBlur={handleBlur}
        />
      </div>
      {isFocused && (
        <div className="dropdown-menu" role="menu">
          <div
            className="dropdown-content"
          >
            {peopleFilter.length
              ? peopleFilter.map(person => (
                <a
                  className="dropdown-item"
                  key={person.name}
                  href="/#"
                  onClick={event => selectPerson(event, person)}
                  onMouseEnter={() => setIsListHovered(true)}
                  onMouseLeave={() => setIsListHovered(false)}
                >
                  <p className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </a>
              ))
              : 'No matching suggestions'}
          </div>
        </div>
      )}

    </div>
  );
};
