import React, { useState } from 'react';
import './Dropdown.scss';
import { Person } from '../../types/Person';

type Props = {
  persons: Person[];
  handleSelect: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = ({ persons, handleSelect }) => {
  const [query, setQuery] = useState('');
  const [onToched, setOnToched] = useState(false);

  const howCaseEnter = (query: string, person: Person) => {
    if (query === query.toLowerCase()) {
      return person.name.toLowerCase().includes(query);
    }

    return person.name.includes(query);
  };

  const filteredPersons = persons.filter(person => howCaseEnter(query, person));

  return (
    <div className={`dropdown ${onToched && "is-active"}`}>
      <div className="dropdown-trigger">
        <input
          value={query}
          onClick={() => setOnToched(!onToched)}
          onChange={(event) => setQuery(event.target.value)}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPersons.map(person => (
            <a
              type="button"
              className="dropdown-item"
              onClick={() => handleSelect(person)}
            >
              {person.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
