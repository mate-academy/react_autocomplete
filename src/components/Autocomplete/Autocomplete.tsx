import React, { useState, useMemo } from 'react';
import { peopleFromServer } from '../../data/people';
import { DropdownInput } from '../DropdownInput';
import { DropdownList } from '../DropdownList';
import { Person } from '../../types/Person';

interface Props {
  setSelectedPerson: (person: Person) => void;
}

export const Autocomplete: React.FC<Props> = React.memo(({
  setSelectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);

  const filteredPeople = useMemo(() => {
    const normilizedQuery = appliedQuery.trim().toLowerCase();

    return peopleFromServer
      .filter(({ name }) => name.toLowerCase().includes(normilizedQuery));
  }, [appliedQuery]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!e.relatedTarget?.classList.contains('dropdown-item')) {
      setIsListShown(false);
    }
  };

  return (
    <div className="dropdown is-active">
      <DropdownInput
        query={query}
        setQuery={setQuery}
        setAppliedQuery={setAppliedQuery}
        delay={1000}
        setIsListShown={setIsListShown}
        onBlur={handleBlur}
      />
      {isListShown && (
        <DropdownList
          people={filteredPeople}
          setQuery={setQuery}
          setIsListShown={setIsListShown}
          setSelectedPerson={setSelectedPerson}
        />
      )}
    </div>
  );
});
