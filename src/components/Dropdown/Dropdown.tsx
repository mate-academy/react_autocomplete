import { Person } from '../../types/Person';
import { PeopleList } from '../PeopleList/PeopleList';

type Prop = {
  filteredPeople: Person[],
  query: string,
  onQuery: (value: string) => void,
  applyQuery: string,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSelectPerson: (person: Person) => void,
};

export const Dropdown: React.FC<Prop> = ({
  filteredPeople,
  query,
  onQuery,
  applyQuery,
  onInputChange,
  onSelectPerson,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={onInputChange}
        />
      </div>

      <button
        type="button"
        onClick={() => onQuery('')}
      >
        X
      </button>

      {(query && query === applyQuery) && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <p>No matching suggestions</p>
            ) : (
              <PeopleList
                people={filteredPeople}
                onSelect={onSelectPerson}
                onQuery={onQuery}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
