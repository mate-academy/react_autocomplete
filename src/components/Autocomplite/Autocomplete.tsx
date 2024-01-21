import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';
import { Person } from '../../types/Person';
import { getPreparedPeople } from '../services/people';

interface Props {
  selectedPerson: Person | null;
  delay: number;
  onSelected: (value: Person) => void;
}

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  delay,
  onSelected,
}) => {
  const people = getPreparedPeople();
  const delayBlur = 100;

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isHide, setIsHide] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

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
        delay={delayBlur}
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
        />
      )}
    </div>
  );
};
