import React, { useState } from "react";
import { Person } from "../types/Person";
import { PersonInfo } from "./PersonInfo";

type Props = {
  peoples: Person[];
  onSelect: (selectPerson: Person) => void;
}

export const SelectForm: React.FC<Props> = ({ peoples, onSelect }) => {

  const [query, setQuery] = useState<string>('');

  const filteredPeople = peoples.filter(person => {
    return person.name.toLowerCase().includes(query.toLowerCase());
  })

  const handelPerson = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
  }

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <PersonInfo
              person={person}
              key={person.name}
              onClick={handelPerson}
            />
          ))}



          {/* <div className="dropdown-item" data-cy="suggestion-item">
            <p className="has-text-link">Pieter Bernard Haverbeke</p>
          </div>

          <div className="dropdown-item" data-cy="suggestion-item">
            <p className="has-text-link">Pieter Antone Haverbeke</p>
          </div>

          <div className="dropdown-item" data-cy="suggestion-item">
            <p className="has-text-danger">Elisabeth Haverbeke</p>
          </div>

          <div className="dropdown-item" data-cy="suggestion-item">
            <p className="has-text-link">Pieter de Decker</p>
          </div>

          <div className="dropdown-item" data-cy="suggestion-item">
            <p className="has-text-danger">Petronella de Decker</p>
          </div>

          <div className="dropdown-item" data-cy="suggestion-item">
            <p className="has-text-danger">Elisabeth Hercke</p>
          </div> */}

        </div>
      </div>
    </div>
  )
}
