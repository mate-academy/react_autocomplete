import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelected?: ((person: Person | null) => void),
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => { },
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShownList, setIsShownList] = useState(false);

  if (query === '') {
    onSelected(null);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsShownList(true);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery, people]);

  const handleSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    applyQuery(person.name);
    setIsShownList(false);
  };

  return (
    <div className={classNames(
      'dropdown',
      { 'is-active': isShownList },
    )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            setIsShownList(true);
          }}
          onBlur={() => {
            setIsShownList(false);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length === 0 ? (
            <div className="dropdown-item dropdown-item--no-suggestion">
              <p>No matching suggestions</p>
            </div>
          )
            : (filteredPeople.map(person => (
              <div
                className="dropdown-item"
                role="button"
                key={person.slug}
                onMouseDown={() => handleSelect(person)}
                onKeyDown={() => handleSelect(person)}
                tabIndex={0}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex !== 'm',
                  })}
                >
                  {person.name}
                </p>
              </div>
            )))}
        </div>
      </div>

    </div>
  );
};
