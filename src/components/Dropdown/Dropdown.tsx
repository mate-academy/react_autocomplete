import React from 'react';
import { Person } from '../../types/Person';
import { PersonInfo } from '../PersonInfo';

interface Props {
  people: Person[];
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => void;
}

export const Dropdown: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      {people.length ? (
        <div className="dropdown-content">
          {people.map(person => (
            <PersonInfo person={person} key={person.slug} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="dropdown-item p-0" data-cy="suggestion-item">
          <div
            className="
      notification
      is-danger
      is-light
      mt-3
      is-align-self-flex-start
      "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        </div>
      )}
    </div>
  );
};
