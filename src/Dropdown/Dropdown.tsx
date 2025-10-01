import React from 'react';
import DropdownItem from '../DropdownItem/DropdownItem';
import { Person } from '../types/Person';

type Props = {
  suggestions: Person[];
  selectedPerson?: Person;
  onSelect: (slug: string) => void;
};

const Dropdown: React.FC<Props> = ({
  suggestions,
  selectedPerson,
  onSelect,
}: Props) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {suggestions.map((suggestion: Person) => (
          <DropdownItem
            key={suggestion.slug}
            suggestion={suggestion}
            isSelected={selectedPerson?.slug === suggestion.slug}
            onClick={() => onSelect(suggestion.slug)}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Dropdown);
