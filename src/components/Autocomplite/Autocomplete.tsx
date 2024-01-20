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
  // const [query, setQuery] = useState('');
  const [isHide, setIsHide] = useState(false);

  return (
    <div className="dropdown is-active">
      <PeopleDropdown
        isHide={isHide}
        selectedPerson={selectedPerson}
        setIsHide={setIsHide}
      />

      {isHide && (
        <PeopleMenu
          people={peopleFromServer}
          selectedPerson={selectedPerson}
          onSelected={onSelected}
          setIsHide={setIsHide}
        />
      )}
    </div>
  );
};
