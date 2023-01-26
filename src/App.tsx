import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { DropDownMenu } from './components/DropDownMenu';
import { peopleFromServer } from './data/people';
import { PersonType } from './types/PersonType';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonType | null>(null);
  const [showList, setShowList] = useState(false);

  const debounce = (
    f: (args: string) => void,
    delay: number,
  ) => {
    let timerId: number;

    return (args: string) => {
      clearTimeout(timerId);
      timerId = window.setTimeout(f, delay, args);
    };
  };

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ), [],
  );

  const visiblePeople = useMemo(() => (
    peopleFromServer.filter((person) => (
      person.name.toLowerCase().includes(query.trim().toLowerCase())))
  ),
  [peopleFromServer, appliedQuery]);

  const handleSelect = useCallback((person: PersonType) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setShowList(false);
  }, [applyQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setShowList(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {(selectedPerson)
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
            onChange={handleInputChange}
          />
        </div>

        {showList && (
          <div className="dropdown-menu" role="menu">
            <DropDownMenu list={visiblePeople} onSelect={handleSelect} />
          </div>
        )}
      </div>
    </main>
  );
};
