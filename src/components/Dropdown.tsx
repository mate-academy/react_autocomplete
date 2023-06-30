/* eslint-disable max-len */
import { Person } from '../types/Person';
import './Dropdown.scss';

type Props = {
  query: string,
  setQuery: (query: string) => void,
  appliedQuery: string,
  applyQuery: (query: string) => void,
  filteredPeople: Person[],
  onSelected: (person: Person | null) => void,
  handleReset: () => void,
};

export const Dropdown: React.FC<Props> = ({
  query,
  setQuery,
  appliedQuery,
  applyQuery,
  filteredPeople,
  onSelected,
  handleReset,
}) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    if (query === '') {
      onSelected(null);
    }
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => handleSearch(event)}
        />
        {query && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1024px-Flat_cross_icon.svg.png"
            className="reset"
            alt="reset"
            onClick={handleReset}
          />
        )}
      </div>

      {query && query === appliedQuery && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0 && (
              filteredPeople.map(person => (
                <div className="dropdown-item">
                  {// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                    <p
                      key={person.slug}
                      className="has-text-link"
                      onClick={() => handleSelectPerson(person)}
                    >
                      {person.name}
                    </p>
                  }
                </div>
              )))}
            {!filteredPeople.length && (
              <p>No matching suggestions</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
