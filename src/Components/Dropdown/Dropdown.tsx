import React, { useMemo, useState } from 'react';

import { Person } from '../../types/Person';
import { DropdownContent } from '../DropdownContent';
import { peopleFromServer } from '../../data/people';
import { DropdownInput } from '../DropdownInput';

function getVisiblePeople(list: Person[], query: string): Person[] {
  return [...list].filter(person => person
    .name.toLowerCase().includes(query.trim().toLowerCase()));
}

type Props = {
  setSelectedPerson: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = React.memo(({ setSelectedPerson }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleOnBlur = () => setTimeout(() => setIsFocused(false), 100);
  const handleOnFocus = () => setIsFocused(true);

  const visiblePeople = useMemo(() => {
    return getVisiblePeople(peopleFromServer, appliedQuery);
  }, [appliedQuery]);
  const arePeopleToShow = visiblePeople.length > 0;

  return (
    <div className="dropdown is-active">
      <DropdownInput
        delay={1000}
        query={query}
        setQuery={setQuery}
        setAppliedQuery={setAppliedQuery}
        handleOnBlur={handleOnBlur}
        handleOnFocus={handleOnFocus}
      />

      {isFocused && (
        <div
          className="dropdown-menu"
          role="menu"
          style={{
            maxHeight: 400,
            overflow: 'auto',
          }}
        >
          {arePeopleToShow ? (
            <DropdownContent
              listOfPeople={visiblePeople}
              setSelectedPerson={setSelectedPerson}
              setQuery={setQuery}
              setAppliedQuery={setAppliedQuery}
            />
          ) : (
            <span>No matching suggestions</span>
          )}
        </div>
      )}
    </div>
  );
});
