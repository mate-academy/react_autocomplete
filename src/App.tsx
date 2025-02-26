import React from "react";
import "./App.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import { peopleFromServer } from "./data/people";
import classNames from "classnames";
import debounce from "debounce";

import { Person } from "./types/Person";

function getPeopleList(people: Person[], query: string) {
  return people.filter((person) =>
    person.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
}

export const App: React.FC = () => {
  const delay = 300;
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  let filteredList = peopleFromServer;

  if (appliedQuery.trim()) {
    filteredList = getPeopleList(peopleFromServer, appliedQuery);
  }

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null
            ? "No selected person"
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedPerson(null);
                applyQuery(event.target.value);
              }}
              onClick={() => setIsActive(true)}
              // onBlur={() => setIsActive(false)}
              value={query}
            />
          </div>
          {isActive && filteredList.length && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
              ref={dropdownRef}
            >
              <div className="dropdown-content">
                {filteredList.map((person) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    style={{ cursor: "pointer" }}
                    key={person.slug}
                  >
                    <p
                      className={classNames({
                        "has-text-link": person.sex === "m",
                        "has-text-danger": person.sex === "f",
                      })}
                      onClick={() => {
                        setSelectedPerson(person);
                        setQuery(person.name);
                      }}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!filteredList.length && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
