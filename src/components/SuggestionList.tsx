import { Person } from '../types/Person';

export const SuggestionList = ({
  filteredPeople,
  onSelected,
}: {
  filteredPeople: Person[];
  onSelected: (selected: Person) => void;
}) => {
  //const field = useRef<HTMLInputElement>(null);

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {filteredPeople.map((person: Person) => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.name}
            onClick={() => {
              onSelected(person);
            }}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
