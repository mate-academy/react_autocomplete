import React from 'react';
import { Person } from '../../types/Person';
import { PersonItem } from '../PersonItem';

interface Props {
  people: Person[];
  selectedPerson: Person | null;
  onSelected: (value: Person) => void;
  setIsNotHide: (value: boolean) => void;
  setQuery: (value: string) => void;
  setAppliedQuery: (value: string) => void;
}

export const PeopleMenu: React.FC<Props> = ({
  people,
  selectedPerson,
  onSelected,
  setIsNotHide: setIsHide,
  setQuery,
  setAppliedQuery,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length ? (
          people.map(person => (
            <PersonItem
              key={person.slug}
              person={person}
              selectedPerson={selectedPerson}
              onSelected={onSelected}
              setIsNotHide={setIsHide}
              setQuery={setQuery}
              setAppliedQuery={setAppliedQuery}
            />
          ))
        ) : (
          <div className="dropdown-item">
            <p>No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
