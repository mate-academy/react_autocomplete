import React, { useCallback, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { peopleFromServer } from "../data/people";
import type { Person } from "../types/Person";

type Props = {
  onSelected: (person: Person | null) => void;
  delay?: number;
};

const people: Person[] = peopleFromServer;

export const DropDown: React.FC<Props> = React.memo(
  ({ onSelected = () => {}, delay = 300 }) => {
    const [query, setQuery] = useState("");
    const [appliedQuery, setAppliedQuery] = useState("");
    const [hasFocus, setHasFocus] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);
    const dropDownOpen = useMemo(() => debounce(setHasFocus, delay), [delay]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;

      setQuery(newQuery);
      applyQuery(newQuery);
      setHasFocus(false);
      dropDownOpen(true);
    };

    const handleOnSelect = (person: Person) => {
      onSelected(person);
      setQuery(person.name);
      setAppliedQuery(person.name);
      setHasFocus(false);
    };

    const filteredPeople = useMemo(() => {
      return people.filter((person) =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
      );
    }, [appliedQuery]);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleQueryChange}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {hasFocus && (
            <div className="dropdown-content">
              {filteredPeople.length ? (
                filteredPeople.map((person) => {
                  return (
                    <button
                      key={person.slug}
                      type="button"
                      className="dropdown-item button is-white"
                      data-cy="suggestion-item"
                      onMouseDown={() => handleOnSelect(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </button>
                  );
                })
              ) : (
                <div
                  className="dropdown-item"
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
