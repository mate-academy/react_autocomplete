import { memo } from 'react';
import { AutocompleteListItem } from '../AutocompleteListItem';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const AutocompleteList = memo(({ people, onSelected }: Props) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div
        className="dropdown-content"
        style={{ maxHeight: '240px', overflowY: 'auto' }}
      >
        {people.map(person => (
          <AutocompleteListItem
            key={person.slug}
            person={person}
            onSelected={onSelected}
          />
        ))}
      </div>
    </div>
  );
});

AutocompleteList.displayName = 'AutocompleteList';
