import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { UserList } from './UserList';
import { Person } from '../types/Person';

type Props = {
  delay: number;
  people: Person[];
  onSelected: (person: Person) => void;
};
export const IntputComponent: React.FC<Props> = React.memo((({
  delay,
  people,
  onSelected,

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    setActiveDropdown(false);
    setInputValue(value);
    applyValue(value);
  };

  const handleClickPerson = useCallback((person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setAppliedValue(person.name);
    setActiveDropdown(false);
  }, [onSelected]);

  const onBlur = useCallback(debounce(
    () => setActiveDropdown(false), delay,
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
