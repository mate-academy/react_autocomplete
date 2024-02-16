import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import classNames from "classnames";
import { Person } from "../types/Person";

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState<string>("");
  const [appliedQuery, setAppliedQuery] = useState<string>("");
  const [showAllPeople, setShowAllPeople] = useState<boolean>(false);

  // eslint-disable-next-line
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const filteredPeople: Person[] = people.filter((person) =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const handleInputFocus = useCallback(() => {
    if (!query) {
      setShowAllPeople(true);
    }
  }, [query]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        setShowAllPeople(true);
      }

      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelected(null);
    },
    [applyQuery, onSelected],
  );

  const handleClickPerson = useCallback(
    (person: Person) => {
      setQuery(person.name);
      setAppliedQuery("");
      onSelected(person);
      setShowAllPeople(false);
    },
    [onSelected],
  );

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            name="person"
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={handleInputFocus}
            onChange={handleInputChange}
          />
        </div>

        {showAllPeople && filteredPeople.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person) => {
                const { name, sex, slug } = person;

                return (
                  <div
                    key={slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                  >
                    <input
                      id={slug}
                      name="personName"
                      type="radio"
                      value={name}
                      style={{ visibility: "hidden" }}
                      onClick={() => handleClickPerson(person)}
                    />
                    <label
                      htmlFor={slug}
                      className={classNames(
                        { "has-text-link": sex === "m" },
                        { "has-text-danger": sex === "f" },
                      )}
                      style={{ cursor: "pointer" }}
                    >
                      {name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!filteredPeople.length && (
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
    </>
  );
};
