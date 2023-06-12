import classnames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  searchResults: Person[] | null;
  onSelect: (person: Person) => void;
  setIsDropdownActive: (isActive: boolean) => void;
  activePersonSlug: string | null;

};

export const DropdownMenu: React.FC<Props> = (
  {
    searchResults,
    onSelect,
    setIsDropdownActive,
    activePersonSlug,
  },
) => {
  if (searchResults && searchResults.length === 0) {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <p
              className="has-text-danger"
            >
              No matching suggestions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {(
          searchResults?.map((person) => (
            <button
              type="button"
              className={classnames('dropdown-item', 'button is-white',
                {
                  'is-active': activePersonSlug === person.slug,
                })}
              key={person.slug}
              onClick={() => {
                onSelect(person);
                setIsDropdownActive(false);
              }}
            >
              <p className="has-text-link">{person.name}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
