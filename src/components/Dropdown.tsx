import { FC, useState } from 'react';
import { Person } from '../types/Person';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  people: Person[];
}

export const Dropdown:FC<Props> = ({ people }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <DropdownMenu preparedPersons={people} />
    </div>
  );
};
