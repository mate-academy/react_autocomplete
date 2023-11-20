/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropdownList } from './DropdownList';
import { Person } from './types/Person';

function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [people] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField && selectedPerson) {
      titleField.current?.focus();
    }
  }, [selectedPerson]);

  const prepareArray = useMemo(() => {
    return people.filter((person) => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery, people]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    setSelectedPerson(null);
    setShowDropdown(!!e.target.value);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setShowDropdown(false);
    setAppliedQuery('');
  };

  const handleInputClick = () => {
    if (selectedPerson || !query) {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">{`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}</h1>
      ) : (
        <h1>No selected person</h1>
      )}

      <div className={
        cn('dropdown', { 'is-active': showDropdown && prepareArray.length })
      }
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            ref={titleField}
            value={query}
            onChange={handleInputChange}
            onClick={handleInputClick}
          />

          {prepareArray.length ? (
            <DropdownList
              people={prepareArray}
              onSelect={handleSelectPerson}
              selectedPerson={selectedPerson}
            />
          ) : (
            <h1>No matching suggestions</h1>
          )}
        </div>
      </div>
    </main>
  );
};
