import React from 'react';
import { Person } from '../types/Person';

interface Props {
  person: Person;
  onSelected: (event: React.MouseEvent, personSlug: string) => void;
}

export const ListItem: React.FC <Props> = ({ person, onSelected }) => {
  return (
    <a
      href="#/"
      className="has-text-link"
      onClick={(event) => onSelected(event, person.slug)}
    >
      {person.name}
    </a>
  );
};
