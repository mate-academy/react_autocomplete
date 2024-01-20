import React, { useMemo, useState } from 'react';
import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';
import { Person } from '../../types/Person';
import { getPreparedPeople } from '../services/people';

interface Props {
  selectedPerson: Person | null;
  onSelected: (value: Person) => void;
}

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
}) => {
  const people = getPreparedPeople();

  const [query, setQuery] = useState('');
  // const [appliedQuery, setAppliedQuery] = useState('');
  const [isHide, setIsHide] = useState(false);

  const filteredPeople = useMemo(() => {
    return people
      .filter(person => {
        return person.name.toLowerCase().includes(query.toLowerCase().trim());
      });
  }, [people, query]);

  return (
    <div className="dropdown is-active">
      <PeopleDropdown
        isHide={isHide}
        selectedPerson={selectedPerson}
        setIsHide={setIsHide}
        query={query}
        setQuery={setQuery}
      />

      {isHide && (
        <PeopleMenu
          people={filteredPeople}
          selectedPerson={selectedPerson}
          onSelected={onSelected}
          setIsHide={setIsHide}
        />
      )}
    </div>
  );
};
