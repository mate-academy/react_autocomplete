import React, { useCallback, useMemo, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const DropDownList: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [select, setSelect] = useState('');
  const [isShown, setIsShown] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelect(event.target.value);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setIsShown(false);
    onSelected(person);
  };

  const filteredPeople = useMemo(() => {
    const trimmedSelect = select.toLowerCase().trim();

    return people.filter((person) => person.name.toLowerCase()
      .includes(trimmedSelect));
  }, [people, select]);

  const delayedSetSelect = useCallback(
    debounce((value: string) => {
      setSelect(value);
    }, delay),
    [delay],
  );

  useEffect(() => {
    delayedSetSelect(query);

    return delayedSetSelect.cancel;
  }, [delayedSetSelect, query]);

  return (
    <div className={classNames('dropdown', {
      'is-active': isShown,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInput}
          value={query}
          onFocus={() => setIsShown(true)}
          onBlur={() => setIsShown(false)}
        />
      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? (
            filteredPeople.map((person) => (
              <a
                className="dropdown-item"
                href="/"
                key={person.slug}
                onMouseDown={() => handleSelectPerson(person)}
              >
                {person.name}
              </a>
            ))
          ) : (
            <p>No matching suggestion</p>
          )}
        </div>
      </div>
    </div>
  );
};
