import React, { useEffect, useState } from 'react';
import './Dropdown.scss';
import { Person } from '../../types/Person';

type Props = {
  persons: Person[];
  handleSelect: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({ persons, handleSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [onToched, setOnToched] = useState(false);

  const onDelete = () => {
    handleSelect(null);
    setQuery('');
  };

  const howCaseEnter = (text: string, person: Person) => {
    if (text === text.toLowerCase()) {
      return person.name.toLowerCase().includes(text);
    }

    return person.name.includes(query);
  };

  const filteredPersons = persons.filter(person => howCaseEnter(query, person));

  useEffect(() => {
    if (selectedPerson) {
      setQuery(selectedPerson.name);
    }
  }, [selectedPerson]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    handleSelect(person);
    setQuery(person.name);
    setOnToched(false);
  };

  return (
    <div className={`dropdown ${onToched && 'is-active'}`}>
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

      {query && (
        <button
          type="button"
          className="delete is-large"
          onClick={onDelete}
        >
          X
        </button>
      )}

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPersons.map(person => (
            <button
              key={filteredPersons.indexOf(person)}
              type="button"
              className="dropdown-item"
              onClick={() => handleSelectPerson(person)}
            >
              {person.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
