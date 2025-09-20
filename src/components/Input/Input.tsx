import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  query: string;
  onFocus: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setPeople: (people: Person[]) => void;
}

export const Input: React.FC<Props> = ({
  query,
  onFocus,
  onChange,
  setPeople,
}) => (
  <div className="dropdown-trigger">
    <input
      type="text"
      data-cy="search-input"
      placeholder="Enter a part of the name"
      value={query}
      onFocus={onFocus}
      onChange={onChange}
      onBlur={() => setPeople([])}
    />
  </div>
);
