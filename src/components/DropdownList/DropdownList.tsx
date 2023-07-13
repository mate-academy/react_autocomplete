import { Person } from '../../types/Person';
import './DropdownList.scss';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const DropdownList: React.FC<Props> = ({
  people,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        { people.length > 0
          ? people.map((man) => (
            <button
              key={`${man.name}-${man.born}`}
              className="dropdown-item"
              type="button"
              onClick={() => onSelect(man)}
            >
              {man.name}
            </button>
          ))
          : (
            <div className="dropdown-item dropdown-item--no-item">
              No matching suggestions
            </div>
          )}
      </div>
    </div>
  );
};
