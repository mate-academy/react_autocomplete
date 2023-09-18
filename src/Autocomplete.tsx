import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';
import { Deley } from './types/Deley';

type Props = {
  deley: Deley;
  setSelectedPerson: (person: Person) => void;
};

function filterPeopleByQuery(peopleToFilter: Person[], query: string) {
  const transformedQuery = query.toLowerCase().trim();

  return peopleToFilter
    .filter(({ name }) => name.toLocaleLowerCase().includes(transformedQuery));
}

export const Autocomplete: React.FC<Props> = ({ deley, setSelectedPerson }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setHasFocus(false);
    }, 0);
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
    person: Person,
  ) => {
    e.preventDefault();
    setSelectedPerson(person);
    setQuery(pervQuery => person.name || pervQuery);
  };

  return (
    <div className={cn('dropdown', { 'is-active': hasFocus })}>
      <DropdownInput
        query={query}
        handleQueryChange={handleQueryChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
      />
      <DropdownMenu
        filteredPeople={filteredPeople}
        onSelect={handlePersonSelect}
      />
    </div>
  );
};
