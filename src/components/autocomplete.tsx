import { useCallback, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

import './autocomplete.scss';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelect?: (person: Person) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect = () => { },
  delay,
}) => {
  const queryField = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focusInput, setFocusInput] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = people.filter(person => {
    return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
  });

  const handlerSelectPerson = (person: Person) => {
    setQuery(person.name);
    onSelect(person);
    setFocusInput(false);
  };

  const handlerClearQuery = () => {
    setQuery('');
    setAppliedQuery('');
    if (queryField.current) {
      queryField.current.focus();
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          ref={queryField}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setFocusInput(true)}
        />
        {query && (
          <button
            type="button"
            className="delete is-medium dropdown-close"
            onClick={handlerClearQuery}
          >
            x
          </button>
        )}

      </div>

      {focusInput && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length !== 0
              ? (filteredPeople.map((person: Person) => (
                <div
                  role="button"
                  tabIndex={0}
                  key={person.name}
                  className="dropdown-item"
                  onClick={() => handlerSelectPerson(person)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handlerSelectPerson(person);
                    }
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              )))
              : (
                <div className="dropdown-item">
                  <p
                    className="has-text-grey-lighter"
                  >
                    No matching suggestions
                  </p>
                </div>
              )}
          </div>
        </div>
      )}

    </div>
  );
};
