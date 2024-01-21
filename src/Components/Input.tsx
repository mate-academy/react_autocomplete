import React from 'react';
import { Person } from '../types/Person';

interface Props {
  query: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  delayOnBlur: () => void;
  selectedPerson: Person | null;
  reset: () => void;
  setIsVisible: () => void;
}
export const Input: React.FC<Props> = ({
  query,
  handleInputChange,
  delayOnBlur,
  selectedPerson,
  setIsVisible,
  reset,
}) => (
  <div className="dropdown-trigger control has-icons-right">
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={handleInputChange}
      onFocus={setIsVisible}
      onBlur={delayOnBlur}
    />

    {selectedPerson && (
      <span className="icon is-small is-right">
        <button
          onClick={reset}
          type="button"
          className="delete is-small"
        >
          x
        </button>
      </span>
    )}
  </div>
);
