import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [showList, setShowList] = useState(true);

  const getVisiblePeople = () => {
    return people
      .filter(person => person.name.toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()));
  };

  const handleTyping = (value: string) => {
    setQuery(value);
    setShowList(true);
  };

  const applyQuery = useCallback(
    debounce(handleTyping, delay),
    [],
  );

  const handleInputChange = (inputValue: string) => {
    setQuery(inputValue);
    applyQuery(inputValue);
    setShowList(false);
  };

  const visiplePeople = useMemo(
    getVisiblePeople,
    [people, query],
  );

  const onPersonSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setShowList(false);
  };

  const onPressKey = (person: Person) => {
    return (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        setQuery(person.name);
        onSelected(person);
      }
    };
  };

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': showList },
      )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          autoComplete="off"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
        />
      </div>

      {showList && (
        <div className="dropdown-menu" role="menu">
          <ul className="dropdown-content">
            {visiplePeople.length
              ? (visiplePeople.map(person => (
                <div
                  role="button"
                  tabIndex={0}
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => onPersonSelect(person)}
                  onKeyUp={() => onPressKey(person)}
                >
                  <p
                    className={person.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
                  >
                    {person.name}
                  </p>
                </div>
              )))
              : (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
          </ul>
        </div>
      )}
    </div>
  );
};
