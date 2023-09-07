import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { DropDownMenu } from './components/DropDownMenu';
import { peopleFromServer } from './data/people';
import { useDebounce } from './service/debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [isFocus, setIsFocus] = useState(false);

  const applyQuery = useCallback(useDebounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const selectPerson = (personName : string) => {
    setSelectedPerson(
      peopleFromServer.find(person => person.name === personName),
    );
    setQuery('');
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(query.toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              handleQueryChange(event);
            }}
            onBlur={() => setIsFocus(false)}
            onFocus={() => setIsFocus(true)}
          />
        </div>
        {isFocus && (
          <DropDownMenu people={filterPeople} onSelect={selectPerson} />
        )}
      </div>
    </main>
  );
};
