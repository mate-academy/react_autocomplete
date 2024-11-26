import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu';


function debounce(callback: Function, delay: number = 300) {
  let timerId: number = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args)
    }, delay)
  };
}

export const App: React.FC = () => {
  const [name, setName] = useState('');
  const [appliedPerson, setAppliedPerson] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const applyPerson = useMemo(() => debounce(setAppliedPerson, 1000), []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) =>
      person.name.toLowerCase().includes(appliedPerson.toLowerCase()),
    );
  }, [appliedPerson]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    applyPerson(e.target.value);
    setSelectedPerson(null);
  };

  const onSelected = useCallback(
    (person: Person): void => {
      setName(person.name);
      setAppliedPerson('');
      setSelectedPerson(person);
      setIsDropdownActive(false);
    },
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          ref={dropdownRef}
          className={cn('dropdown', { 'is-active': isDropdownActive })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={name}
              onChange={onSearch}
              onFocus={() => setIsDropdownActive(true)}
            />
          </div>

          <DropdownMenu filteredPeople={filteredPeople} onSelected={onSelected} />
        </div>
      </main>
    </div>
  );
};
