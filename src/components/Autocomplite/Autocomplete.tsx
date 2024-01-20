import React, { useState } from 'react';
import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

interface Props {
  selectedPerson: Person | null;
  onSelected: (value: Person) => void;
}

export const Autocomplete: React.FC<Props> = ({
  selectedPerson,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  // const [appliedQuery, setAppliedQuery] = useState('');
  const [isHide, setIsHide] = useState(false);

  const filteredPeople = () => {
    return peopleFromServer
      .filter(person => {
        return person.name.toLowerCase().includes(query.toLowerCase().trim());
      });
  };

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
          people={filteredPeople()}
          selectedPerson={selectedPerson}
          onSelected={onSelected}
          setIsHide={setIsHide}
        />
      )}
    </div>
  );
};
