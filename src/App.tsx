import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { UserList } from './components/UserList';
import { Person } from './types/Person';

export const App: React.FC = React.memo((() => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState('');
  const [appliedValue, setAppliedValue] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyValue = useCallback(
    debounce((value: string) => setAppliedValue(value), 1000),
    [],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(appliedValue.toLowerCase()),
    );
  }, [appliedValue, people]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setInputValue(value);
      applyValue(value);
    },
    [applyValue],
  );

  const handleClickPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setAppliedValue(person.name);
    setActiveDropdown(false);
  }, [setSelectedPerson, setInputValue, setActiveDropdown]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson && `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
      </h1>

      <div
        className={cn('dropdown', { 'is-active': activeDropdown })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            value={inputValue}
            placeholder="Enter a part of the name"
            className="input"
            onChange={(e) => handleInputChange(e)}
            onFocus={() => setActiveDropdown(true)}
            autoComplete="off"
          />
        </div>

        <UserList
          people={filteredPeople}
          handleClickPerson={handleClickPerson}
        />
      </div>
    </main>
  );
}));
