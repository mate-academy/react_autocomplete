import { memo } from 'react';
import { Person } from '../../types/Person';

type Prop = {
  visible: boolean;
  people: Person[];
  onSelected: (person: Person) => void;
};
export const Dropdown = memo(function Dropdown({
  visible,
  people,
  onSelected,
}: Prop) {
  return (
    <>
      {visible && people.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(item => (
              <button
                type="button"
                role="menuitem"
                key={item.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => onSelected(item)}
              >
                <p
                  className={`${item.sex === 'f' ? 'has-text-danger' : 'has-text-link'}`}
                >
                  {item.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
