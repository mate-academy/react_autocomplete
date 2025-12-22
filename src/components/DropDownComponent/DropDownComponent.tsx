import React from 'react';

import { Person } from '../../types/Person';
import { DropDownInput } from '../DropDownInput';
import { DropDownMenu } from '../DropDownMenu';

type Props = {
  query: string;
  isMenuOpen: boolean;
  suggestions: Person[];
  onQueryChange: (newQuery: string) => void;
  onSelect: (person: Person) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
};

export const DropDownComponent: React.FC<Props> = ({
  query,
  suggestions,
  isMenuOpen,
  onQueryChange,
  onSelect,
  setIsMenuOpen,
}) => {
  return (
    <>
      <div className={`dropdown ${isMenuOpen ? 'is-active' : ''}`}>
        <DropDownInput
          query={query}
          onQueryChange={onQueryChange}
          onToggleMenu={setIsMenuOpen}
        />

        {isMenuOpen && (
          <DropDownMenu suggestions={suggestions} onSelect={onSelect} />
        )}
      </div>
      {isMenuOpen && suggestions.length === 0 && query && (
        <div
          className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
