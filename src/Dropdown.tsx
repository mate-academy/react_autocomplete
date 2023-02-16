import React, { useState, useEffect } from "react";
import cn from "classnames";
import { Person } from "./types/Person";

type Props = {
  onSelect: (person: Person) => void;
  people: Person[];
};

export const Dropdown: React.FC<Props> = ({ onSelect, people }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
      setIsTyping(false);
    }, 1000);

    return () => {
      clearTimeout(timerId);
      setIsTyping(true);
    };
  }, [query]);

  const visiblePeople = people.filter((person) => {
    return person.name.toLowerCase().includes(debouncedQuery.toLowerCase());
  });

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {debouncedQuery.length > 0 &&
            !isTyping &&
            visiblePeople.map((person) => (
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onSelect(person);
                  setDebouncedQuery("");
                  setQuery("");
                }}
              >
                <p
                  className={cn({
                    "has-text-link": person.sex === "m",
                    "has-text-danger": person.sex === "f",
                  })}
                >
                  {person.name}
                </p>
              </button>
            ))}

          {debouncedQuery.length > 0 && !visiblePeople.length && (
            <h2>No matching suggestions</h2>
          )}
        </div>
      </div>
    </div>
  );
};
