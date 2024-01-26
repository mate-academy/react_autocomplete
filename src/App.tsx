/* eslint-disable @typescript-eslint/quotes */
import React, { useCallback, useMemo, useState } from "react";
import "./App.scss";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { peopleFromServer } from "./data/people";
import { Person } from "./types/Person";

export const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeople = useMemo(
    () => peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    ), [appliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowMenu(false);

    if (appliedQuery.length === 0) {
      setSelectedPerson(null);
    }

    setQuery(event.target.value);
    applyQuery(event.target.value);

    setTimeout(() => setShowMenu(true), 1000);
  };

  const handleItemClick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
          </h1>
        )
        : (
          <h1 className="title">No selected person</h1>
        )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowMenu(true)}
            onBlur={() => setShowMenu(false)}
          />
        </div>

        {showMenu && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length ? (
                filteredPeople.map((person) => (
                  <div className="dropdown-item" key={person.slug}>
                    <a
                      href={`#${person.slug}`}
                      onMouseDown={() => handleItemClick(person)}
                      className={classNames(
                        { "has-text-link": person.sex === "m" },
                        { "has-text-danger": person.sex === "f" },
                      )}
                    >
                      {person.name}
                    </a>
                  </div>
                ))
              ) : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
