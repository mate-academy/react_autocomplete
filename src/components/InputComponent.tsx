import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { UserList } from './UserList';
import { Person } from '../types/Person';

type Props = {
  delay: number;
  people: Person[];
  setSelectedPerson: (person: Person) => void;
};
export const IntputComponent: React.FC<Props> = React.memo((({
  delay,
  people,
  setSelectedPerson,

}) => {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const [appliedValue, setAppliedValue] = useState<string>('');

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(
        appliedValue.toLowerCase(),
      ),
    );
  }, [appliedValue, people]);

  const applyValue = useCallback(debounce(
    (value: string) => {
      setAppliedValue(value);
      setActiveDropdown(true);
    }, delay,
  ), []);

  const test2 = useCallback((value: string) => {
    if (value !== appliedValue) {
      applyValue(value);
    }

    if (value === '') {
      setActiveDropdown(true);
    }
  }, [appliedValue, applyValue]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    setActiveDropdown(false);
    setInputValue(value);
    test2(value);
  };

  const handleClickPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setAppliedValue(person.name);
    setActiveDropdown(false);
  }, [setSelectedPerson]);

  const onBlur = useCallback(debounce(
    () => setActiveDropdown(false), 100,
  ), []);

  return (
    <div
      className={classNames('dropdown', { 'is-active': activeDropdown })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          value={inputValue}
          placeholder="Enter a part of the name"
          className="input"
          onFocus={() => setActiveDropdown(true)}
          onChange={(e) => handleInputChange(e)}
          onBlur={onBlur}
        />
      </div>

      <UserList
        people={filteredPeople}
        handleClickPerson={handleClickPerson}
      />
    </div>
  );
}
));
