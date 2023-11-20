import React, { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  onSelected: (person: Person) => void;
  delay: number,
};

const normalizeInputQuery = (query: string) => {
  return query.trim().toLowerCase();
};

// function debounce(f: Function, delay: number) {
//   let timerId = 0;

//   return (...args: any) => {
//     window.clearTimeout(timerId);

//     timerId = window.setTimeout(() => f(args), delay);
//   };
// }

export const Dropdown: React.FC<Props> = ({
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShownList, setIsShownList] = useState(false);

  const getFullList = () => {
    if (!query) {
      setIsShownList(true);
    }
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) => (
      person.name.toLowerCase().includes(normalizeInputQuery(appliedQuery))
    ));
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsShownList(true);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    onSelected(person);
    setIsShownList(false);
  };

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query || appliedQuery) {
      setQuery('');
      setAppliedQuery(event.target.value);
      applyQuery('');
      setTimeout(() => {
        setIsShownList(false);
      }, 200);
    } else {
      setTimeout(() => {
        setIsShownList(false);
      }, 200);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={getFullList}
          onBlur={handleOnBlur}
        />
      </div>

      {isShownList && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filteredPeople.length ? (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            ) : (
              filteredPeople.map((person: Person) => (
                <a
                  key={person.name + person.born}
                  href="/"
                  className={classNames('dropdown-item', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={(event) => handleSelectedPerson(event, person)}
                >
                  {person.name}
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
