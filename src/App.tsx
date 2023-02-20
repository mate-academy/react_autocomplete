import React, { useEffect, useState } from "react";
import "./App.scss";
import debounce from "lodash/debounce";
import cn from "classnames";
import { peopleFromServer } from "./data/people";
import { Dropdown } from "./Dropdown";
import { Person } from "./types/Person";

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [visiblePeople, setVisiblePeople] = useState<Person[]>([]);

  const applyQuery = debounce(setDebouncedQuery, 500);
  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  function handleVisiblePeople() {
    setVisiblePeople(
      peopleFromServer.filter((person) => {
        return person.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      })
    );
  }

  useEffect(() => {
    handleVisiblePeople();
  }, [debouncedQuery, peopleFromServer]);

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    clearQuery();
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} - ${selectedPerson.born} - ${selectedPerson.died}`
          : "No selected person"}
      </h1>

      <div className={cn("dropdown", { "is-active": debouncedQuery })}>
        <div className="dropdown-trigger">
          <div className="control has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleQueryChange}
            />
          </div>
        </div>

        {debouncedQuery && (
          <Dropdown onSelect={selectPerson} visiblePeople={visiblePeople} />
        )}
      </div>
    </main>
  );
};
