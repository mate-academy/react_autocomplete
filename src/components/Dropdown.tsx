import React, { useState, useMemo, useCallback } from 'react';
import { Person } from '../types/Person';

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (args: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}

type Props = {
  people: Person[];
  handleButton: (slugSelect: string) => void
};

export const Dropdown: React.FC<Props> = ({ people, handleButton }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isPeopleVisible, setIsPeopleVisible] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filterPeople = useMemo(() => {
    return people.filter(person => (
      person.name
        .toLocaleLowerCase()
        .includes(appliedQuery.trim().toLocaleLowerCase())
    ));
  }, [appliedQuery, people]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onFocusInput = () => {
    setIsPeopleVisible(true);
  };

  const onBlurInput = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget === null) {
      setIsPeopleVisible(false);
    }
  };

  const clickButton = (selectPerson: Person) => {
    setIsPeopleVisible(false);
    setQuery(selectPerson.name);
    setAppliedQuery(selectPerson.name);
    handleButton(selectPerson.slug);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInput}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
        />

        {filterPeople.length === 0 && (
          <article className="message is-danger">
            <div className="message-body">
              <strong>No matching suggestions</strong>
            </div>
          </article>
        )}
      </div>

      {(isPeopleVisible && filterPeople.length !== 0) && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filterPeople.map(person => (
              <div
                key={person.slug}
                className="
                  dropdown-item
                  is-flex
                  is-justify-content-space-between"
              >
                <p className="has-text-link">
                  {person.name}
                </p>

                <button
                  type="button"
                  className="button is-success is-small"
                  onClick={() => clickButton(person)}
                >
                  <span className="icon is-small">
                    <i className="fas fa-check" />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
