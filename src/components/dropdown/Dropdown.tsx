import React, { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';

type Props = {
  options: Person[],
  onSelected: (person: Person) => void,
  delay: number,
};

export const Dropdown: React.FC<Props> = ({
  options,
  onSelected,
  delay,
}) => {
  const [people] = useState(options);
  const [isListShowed, setIsListShowed] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsListShowed(true);
    setInputValue(event.target.value);
    applyQuery(event.target.value);
  };

  const hadnleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    option: Person,
  ) => {
    event.preventDefault();

    setInputValue(option.name);
    onSelected(option);
    setIsListShowed(false);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery, people]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      {isListShowed && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map((option: Person) => {
              const { name, sex } = option;

              return (
                <div className="dropdown-item">
                  <a
                    href="#/"
                    className={classNames({
                      'has-text-link': sex === 'm',
                      'has-text-danger': sex === 'f',
                    })}
                    onClick={(event) => hadnleItemClick(event, option)}
                  >
                    {name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
