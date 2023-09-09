import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';
import { debounce } from './services/debounce';

const CUSTOM_DELAY = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const selectPerson = (personSlug: string) => {
    const selected = peopleFromServer.find(person => {
      return person.slug === personSlug;
    });

    setSelectedPerson(selected || null);
    setQuery(selected?.name ?? '');
    setAppliedQuery(personSlug);
    setIsDropdownVisible(false);
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, CUSTOMDELAY), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleDropdownToggle = (isVisible: boolean) => {
    setIsDropdownVisible(isVisible);
  };

  return (
    <main className="section">
      <h1 className="title">
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
            value={query}
            onChange={handleChange}
            onFocus={() => handleDropdownToggle(true)}
            onBlur={() => handleDropdownToggle(false)}
          />
        </div>

        {isDropdownVisible && (
          <Dropdown
            people={filteredPeople}
            onSelected={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
