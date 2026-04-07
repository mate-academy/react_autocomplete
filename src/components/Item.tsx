//.. Item.tsx
import type { Person } from '../types/Person';
interface ItemPerson {
  user: Person;
  onSelect: (person: Person) => void;
}
export const Item = ({ user, onSelect }: ItemPerson) => {
  return (
    <>
      <div className="dropdown-item is-clickable" data-cy="suggestion-item">
        <p
          onClick={() => {
            onSelect(user);
          }}
          className={user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
        >
          {user.name}
        </p>
      </div>
    </>
  );
};
