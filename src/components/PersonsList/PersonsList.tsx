import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  persons: Person[];
  onSelected: (name: string) => void;
};

export const PersonsList: React.FC<Props> = ({ persons, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {persons.length > 0
          ? persons.map(item => (
            <button
              type="button"
              className={cn('dropdown-item', {
                'has-text-link': item.sex === 'm',
                'has-text-danger': item.sex === 'f',
              })}
              key={item.name}
              onClick={() => onSelected(item.name)}
            >
              {item.name}
            </button>
          )) : (
            <p className="dropdown-item">
              No matching suggestions
            </p>
          )}
      </div>
    </div>
  );
};
