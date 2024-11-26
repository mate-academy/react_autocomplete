import React from "react";
import { Person } from "../types/Person";

type Props = {
  filteredPeople: Person[];
  onSelected: (person: Person) => void;
}

export const DropdownMenu: React.FC<Props> = React.memo(({ filteredPeople, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {filteredPeople.length > 0 ? (
          filteredPeople.map((person: Person) => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.name}
              onClick={() => onSelected(person)}
              style={{ cursor: 'pointer' }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))
        ) : (
          <div className="dropdown-item">No matching suggestions</div>
        )}
      </div>
    </div>
  );
});
