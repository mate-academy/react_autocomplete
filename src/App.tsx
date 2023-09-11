import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDownMenu } from './components/DropDownMenu/DropDownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [hasFocus, setHasFocus] = useState(false);
  const [selectedPerson, setSelectedPerson]
   = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    setIsLoading(true);
    applyQuery(event.target.value);
  };

  const filtredPeople = useMemo(() => {
    setIsLoading(false);

    return peopleFromServer
      .filter((person) => person
        .name
        .toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  useEffect(() => {
    setHasFocus(false);
  }, [selectedPerson]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onFocus={() => setHasFocus(true)}
            onChange={handleQueryChange}
          />
        </div>

        <DropDownMenu
          people={filtredPeople}
          hasFocus={hasFocus}
          onSelectedPerson={setSelectedPerson}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};
