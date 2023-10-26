import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  personName: string,
  setIsFocused: (val:boolean) => void,
  visiblePeople: Person[],
  handleQuery: (val: React.ChangeEvent<HTMLInputElement>) => void,
};

export const Input: React.FC<Props> = ({
  personName,
  setIsFocused,
  visiblePeople,
  handleQuery,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={personName}
        onFocus={() => setIsFocused(true)}
        onChange={handleQuery}
      />
      {!visiblePeople.length && (
        <span
          className="has-text-danger dropdown-item"
        >
          No matching suggestions
        </span>
      )}
    </div>
  );
};
