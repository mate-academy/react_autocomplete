//.. List.tsx

import { Item } from './Item';
import type { Person } from '../types/Person';

interface ListProps {
  result: Person[];
  onSelect: (person: Person) => void;
}

export const List = ({ result, onSelect }: ListProps) => {
  return (
    <>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {result.map(el => (
            <Item key={el.slug} user={el} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </>
  );
};
