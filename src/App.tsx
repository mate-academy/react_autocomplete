import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelected: React.Dispatch<React.SetStateAction<Person>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AutoComplete: React.FC<Props> = ({
  people,
  onSelected,
  setQuery,
  setDropdown,
}) => {
  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const dataValue = event.currentTarget.getAttribute('data-value');

    if (dataValue) {
      const selectedPerson: Person = JSON.parse(dataValue);

      onSelected(selectedPerson);
      setQuery(selectedPerson.name);
      setDropdown(false);
    }
  }

  return (
    <div className="dropdown-content">
      {people.map(p => (
        <div
          key={p.slug}
          data-value={JSON.stringify(p)}
          className="dropdown-item"
          data-cy="suggestion-item"
          onClick={handleClick}
        >
          <p className={p.sex === 'm' ? 'has-text-link' : 'has-text-danger'}>
            {p.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export const App: React.FC<{ delay?: number }> = ({ delay = 300 }) => {
  //const { name, born, died } = peopleFromServer[0];
  const [person, setPerson] = useState<Person>({} as Person);
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState(query);
  const [showDropdown, setShowDropdown] = useState(true);

  const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(p =>
      p.name.trim().toLowerCase().includes(debounceQuery.toLowerCase()),
    );
  }, [debounceQuery]);

  useEffect(() => {
    inputRef.current.focus();
    const timerId = setTimeout(() => {
      setDebounceQuery(query);
    }, delay);

    return () => clearTimeout(timerId);
  }, [query, delay]);

  function handleChange(inputquery: string) {
    setQuery(inputquery);
    setShowDropdown(true);
    setPerson({} as Person);
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person.name
            ? `${person?.name} (${person?.born} - ${person?.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={e => handleChange(e.target.value)}
            />
          </div>
          {showDropdown && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <AutoComplete
                people={filteredPeople}
                onSelected={setPerson}
                setQuery={setQuery}
                setDropdown={setShowDropdown}
              />
            </div>
          )}
        </div>
        {filteredPeople.length === 0 ? (
          <div
            className="notification
             is-danger is-light
             mt-3 is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          ''
        )}
      </main>
    </div>
  );
};
