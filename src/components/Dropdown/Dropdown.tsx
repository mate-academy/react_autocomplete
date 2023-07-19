import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  setOnSelected: (person: Person) => void,
  delay: number,
};

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  setOnSelected,
  delay,
}) => {
  const [value, setValue] = useState('');
  const [appliedValue, setAppliedValue] = useState('');

  const preparedPeople = useMemo(() => {
    return people.filter(person => (
      person.name.toLowerCase().includes(appliedValue)
    )) || null;
  }, [appliedValue]);

  const applyValue = useCallback(
    debounce(setAppliedValue, delay),
    [delay],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const normalisedEvent = event.target.value.toLowerCase();

    setValue(normalisedEvent);
    applyValue(normalisedEvent);
  };

  const handleClick = useCallback((
    person: Person,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setValue(person.name);
    setOnSelected(person);
    setAppliedValue('');
  }, []);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={value}
          onChange={handleChange}
        />
      </div>

      {(appliedValue) && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {preparedPeople.length
              ? preparedPeople.map(person => (
                <a
                  href={`#${person.slug}`}
                  className={cn('dropdown-item', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={(event) => handleClick(person, event)}
                  key={person.slug}
                >
                  {person.name}
                </a>
              ))
              : (
                <p className="dropdown-item">
                  No matching suggestions
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
});
