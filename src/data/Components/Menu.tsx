import { Person } from '../../types/Person';

type Props = {
  setQuery: (name: string) => void;
  setFocus: (arg: boolean) => void;
  onSelect: (person: Person | null) => void;
  list: Person[];
};

export const Menu: React.FC<Props> = ({
  setQuery,
  setFocus,
  list,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {list.map((person: Person) => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.name}
            onClick={() => (
              onSelect(person), setQuery(person.name), setFocus(false)
            )}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
