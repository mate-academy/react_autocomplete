import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';
import { Person } from '../../types/Person';
import { getPreparedPeople } from '../services/people';

interface Props {
  selectedPerson: Person | null;
  mainDelay: number;
  onSelected: (value: Person) => void;
}

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  mainDelay,
  onSelected,
}) => {
  const blurDelay = 100;

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isHide, setIsHide] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, mainDelay),
    [],
  );

  const people = getPreparedPeople();

  const filteredPeople = useMemo(() => {
    return people
      .filter(person => {
        const normalizedName = person.name.toLowerCase();
        const normalizedQuery = appliedQuery.toLowerCase().trim();

        return normalizedName.includes(normalizedQuery);
      });
  }, [appliedQuery, people]);

  return (
    <div className="dropdown is-active">
      <PeopleDropdown
        delay={[mainDelay, blurDelay]}
        isHide={isHide}
        setIsHide={setIsHide}
        query={query}
        setQuery={setQuery}
        applyQuery={applyQuery}
      />

      {isHide && (
        <PeopleMenu
          people={filteredPeople}
          selectedPerson={selectedPerson}
          onSelected={onSelected}
          setIsHide={setIsHide}
          setQuery={setQuery}
          setAppliedQuery={setAppliedQuery}
        />
      )}
    </div>
  );
};
