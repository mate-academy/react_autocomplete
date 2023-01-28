import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { DropDownMenu } from './components/DropDownMenu';
import { peopleFromServer } from './data/people';
import { debounce } from './desounce';
import { PersonType } from './types/PersonType';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonType | null>(null);
  const [showList, setShowList] = useState(false);

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ), [],
  );

  const visiblePeople = useMemo(() => (
    peopleFromServer.filter((person) => (
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase())))
  ),
  [peopleFromServer, appliedQuery]);

  const handleSelect = useCallback((person: PersonType) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setShowList(false);
  }, [setSelectedPerson, setQuery, setShowList]);

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
          <DropDownMenu list={visiblePeople} onSelect={handleSelect} />
        )}
      </div>
    </main>
  );
};
