import React from 'react';
import { DropdownItem } from './DropdownItem';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
};

export const DropdownMenu: React.FC<Props> = ({ people }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <DropdownItem key={person.slug} name={person.name} />
        ))}

        {/* <div className="dropdown-item" data-cy="suggestion-item">
          <p className="has-text-link">Pieter Bernard Haverbeke</p>
        </div>

        <div className="dropdown-item" data-cy="suggestion-item">
          <p className="has-text-link">Pieter Antone Haverbeke</p>
        </div>

        <div className="dropdown-item" data-cy="suggestion-item">
          <p className="has-text-danger">Elisabeth Haverbeke</p>
        </div>

        <div className="dropdown-item" data-cy="suggestion-item">
          <p className="has-text-link">Pieter de Decker</p>
        </div>

        <div className="dropdown-item" data-cy="suggestion-item">
          <p className="has-text-danger">Petronella de Decker</p>
        </div>

        <div className="dropdown-item" data-cy="suggestion-item">
          <p className="has-text-danger">Elisabeth Hercke</p>
        </div> */}
      </div>
    </div>
  );
};
