import { Person } from '../../types/Person';
import './DropdownList.scss';

type Props = {
  peoples: Person[] | null;
  onSelect: (person: Person) => void;
};

export const DropdownList: React.FC<Props> = ({
  peoples,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        { peoples
          ? peoples.map((man, index) => (
            <div
              key={`${man.name}-${man.born}`}
              className="dropdown-item"
              onClick={() => onSelect(man)}
              onKeyDown={() => onSelect(man)}
              role="button"
              tabIndex={index}
            >
              <p className="has-text-link">{man.name}</p>
            </div>
          ))
          : <div className="dropdown-item">No matching suggestions</div>}
      </div>
    </div>
  );
};
