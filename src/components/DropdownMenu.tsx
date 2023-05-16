import { Person } from '../types/Person';

type Props = {
  searchResults: Person[] | null;
  onSelect: (person: Person) => void;
  setIsDropdownActive: (isActive: boolean) => void;
};

export const DropdownMenu: React.FC<Props> = (
  {
    searchResults,
    onSelect,
    setIsDropdownActive,
  },
) => {
  if (!searchResults) {
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
        {searchResults.length === 0 ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          searchResults.map((person) => (
            <button
              type="button"
              className="dropdown-item button is-white"
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
