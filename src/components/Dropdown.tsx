import React, { useMemo } from 'react';
import { Person } from '../types/Person';

function debounce<T>(callback: T, delay: number) {
  let timerId = 0;

  return (...args) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  people: Person[];
  onSelected: (people: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = (
  {
    people,
    onSelected,
    delay = 300,
  }) => {
  const [query, setQuery] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);
  const [appliesQuery, setAppliesQuery] = React.useState('');

  const filteredPeople = useMemo(() => {
    return people.filter((person: Person) =>
      person.name.toLowerCase().includes(appliesQuery.toLowerCase()),
    );
  }, [appliesQuery, people]);

  const applyQuery = useMemo(() => debounce(setAppliesQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(null);
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  return (
    <div className={isActive ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query || ''}
          data-cy="search-input"
          onChange={handleQueryChange}
          onFocus={() => setIsActive(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length > 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map((person: Person) => (
              <div className="dropdown-items" key={person.name}>
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    onSelected(person);
                    setQuery(person.name);
                    setIsActive(false);
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              </div>
            ))}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-link">Pieter Haverbeke</p>*/}
            {/*</div>*/}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-link">Pieter Bernard Haverbeke</p>*/}
            {/*</div>*/}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-link">Pieter Antone Haverbeke</p>*/}
            {/*</div>*/}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-danger">Elisabeth Haverbeke</p>*/}
            {/*</div>*/}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-link">Pieter de Decker</p>*/}
            {/*</div>*/}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-danger">Petronella de Decker</p>*/}
            {/*</div>*/}

            {/*<div className="dropdown-item" data-cy="suggestion-item">*/}
            {/*  <p className="has-text-danger">Elisabeth Hercke</p>*/}
            {/*</div>*/}
          </div>
        ) : (
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
      </div>
    </div>
  );
};

export default Dropdown;
