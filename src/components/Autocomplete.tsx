import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  setSelectedPerson?: (person: Person) => void | undefined,
};
const trimValue = (value: string) => {
  return value.trim().toLowerCase();
};

export const Autocomplete: React.FC<Props> = ({
  people,
  setSelectedPerson = () => {},
}) => {
  const [value, setValue] = useState('');
  const [appliedValue, setAppliedValue] = useState('');
  const [isShownList, setIsShownList] = useState(false);
  const getFullList = () => {
    if (!value) {
      setIsShownList(true);
    }
  };

  const filtredPeople: Person[] | undefined = useMemo(() => {
    return people.filter((person: Person) => {
      return person.name.toLowerCase().includes(trimValue(appliedValue));
    });
  }, [appliedValue, people]);

  const applyValue = useCallback(debounce(setAppliedValue, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    applyValue(event.target.value);
    setIsShownList(true);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setValue(person.name);
    setSelectedPerson(person);
    setIsShownList(false);
  };

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (value) {
      setValue('');
      setAppliedValue(event.target.value);
      applyValue('');
    }

    setTimeout(() => {
      setIsShownList(false);
    }, 200);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={value}
          onChange={handleQueryChange}
          onFocus={getFullList}
          onBlur={handleOnBlur}
        />
      </div>
      {isShownList && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filtredPeople.length ? (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            ) : (
              filtredPeople.map(person => (
                <a
                  key={person.name}
                  href="/"
                  className={classNames('dropdown-item', {
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
