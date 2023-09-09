import './App.scss';
import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';

function filterPeopleByQuery(peopleToFilter: Person[], query: string) {
  const transformedQuery = query.toLowerCase().trim();

  return peopleToFilter
    .filter(({ name }) => name.toLocaleLowerCase().includes(transformedQuery));
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = () => {
    setHasFocus(true);
  };

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeopleByQuery(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const applyQuery
  = useCallback(debounce(setAppliedQuery, 1000), [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person :Person) => {
    setSelectedPerson(person);
    setQuery(pervQuery => person.name || pervQuery);
    setHasFocus(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': hasFocus })}>

        <DropdownInput
          query={query}
          handleQueryChange={handleQueryChange}
          handleFocus={handleFocus}
        />
        <DropdownMenu
          filteredPeople={filteredPeople}
          onSelect={handlePersonSelect}
        />
      </div>
    </main>
  );
};
