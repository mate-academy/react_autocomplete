import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';

type Props = {
  deley: number;
};

function filterPeopleByQuery(peopleToFilter: Person[], query: string) {
  const transformedQuery = query.toLowerCase().trim();

  return peopleToFilter
    .filter(({ name }) => name.toLocaleLowerCase().includes(transformedQuery));
}

export const Autocomplete: React.FC<Props> = ({ deley }) => {
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

  const applyQuery = debounce(setAppliedQuery, deley);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person :Person,
  ) => {
    e.preventDefault();
    setSelectedPerson(person);
    setQuery(pervQuery => person.name || pervQuery);
    setHasFocus(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
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
