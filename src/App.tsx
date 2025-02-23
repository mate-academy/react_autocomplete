import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './Dropdown';

export const App: React.FC<{ delay?: number }> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [filterPeople, setFilterPeople] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For handling dropdown visibility

  const applyDebounce = useRef<(value: string) => void>();

  useEffect(() => {
    applyDebounce.current = debounce((value: string) => {
      setApplyQuery(value);
    }, delay);

    return () => {
      applyDebounce.current?.cancel();
    };
  }, [delay]);

  useEffect(() => {
    if (applyQuery.trim() === '') {
      setFilterPeople(peopleFromServer);
    } else {
      setFilterPeople(
        peopleFromServer.filter(personFromServer =>
          personFromServer.name
            .toLowerCase()
            .includes(applyQuery.toLowerCase()),
        ),
      );
    }
  }, [applyQuery]);

  const handlePerson = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setFilterPeople([]);
    setIsDropdownOpen(false); // Close the dropdown when a person is selected
  };

  useEffect(() => {
    if (selectedPerson && query.trim() !== selectedPerson.name) {
      const personExists = peopleFromServer.some(
        p => p.name.toLowerCase() === query.toLowerCase(),
      );

      if (!personExists) {
        setSelectedPerson(null);
      }
    }
  }, [query, selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsDropdownOpen(true)} // Show dropdown on focus
              onBlur={e => {
                setTimeout(() => {
                  if (!e.relatedTarget?.classList.contains('dropdown-item')) {
                    setIsDropdownOpen(false);
                  }
                }, 100);
              }} // Hide dropdown after losing focus
              onChange={e => {
                const value = e.target.value;

                setQuery(value);
                applyDebounce.current?.(value);

                if (value.trim() === '') {
                  setFilterPeople(peopleFromServer);
                  setIsDropdownOpen(true);
                }
              }}
            />
          </div>

          <Dropdown
            isOpen={isDropdownOpen}
            filterPeople={filterPeople}
            onSelectPerson={handlePerson}
          />
        </div>
      </main>
    </div>
  );
};
