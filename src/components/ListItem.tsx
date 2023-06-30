import React from 'react';
import { Person } from '../types/Person';

interface Props {
  person: Person;
  onPersonNameClick: (event: React.MouseEvent, personSlug: string) => void;
}

export const ListItem: React.FC <Props> = ({ person, onPersonNameClick }) => (
  <a
    href="#/"
    className="has-text-link"
    onClick={(event) => onPersonNameClick(event, person.slug)}
  >
    {person.name}
  </a>
);
