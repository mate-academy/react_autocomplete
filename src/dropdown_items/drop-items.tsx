import cn from 'classnames';
import { OnSelected, Person } from '../types/Person';

interface Props {
  users: Person[],
  onSelected: OnSelected,
}

export const DropItems: React.FC<Props> = ({ users, onSelected }) => {
  return (
    <div className="dropdown-content">
      {users.map(user => {
        const { sex, slug, name } = user;

        return (
          <div
            className="dropdown-item"
            key={slug}
          >
            <a
              href={`${slug}`}
              onMouseDown={() => onSelected(user)}
              className={cn({
                'has-text-link': sex === 'm',
                'has-text-danger': sex === 'f',
              })}
              key={slug}
            >
              {name}
            </a>
          </div>
        );
      })}
    </div>
  );
};
