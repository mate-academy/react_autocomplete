import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  searchResults: Person[] | null;
  activePersonSlug: string | null;
  onSelect: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = (
  {
    searchResults,
    activePersonSlug,
    onSelect,
  },
) => {
  if (!searchResults) {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {searchResults.length === 0 ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          searchResults.map((person) => (
            <button
              type="button"
              className={classNames('dropdown-item', 'button is-white',
                {
                  'is-active': activePersonSlug === person.slug,
                })}
              key={person.slug}
              onClick={() => onSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
