import React from "react";
import { Person } from "../types/Person";

type Props = {
  person: Person;
  onClick: (person: Person) => void;
}

export const PersonInfo: React.FC<Props> = ({person, onClick}) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onClick(person)}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  )
}
