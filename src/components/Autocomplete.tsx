import cn from 'classnames';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

const toNormalizeQuery = (query: string) => query.trim().toLowerCase();


type Props = {
  onSelected: (person: Person) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [iterateQuery, setIterateQuery] = useState('');
  const [isShown, setIsShown] = useState(false);

  const getFullList = () => !query && setIsShown(true);

  const applyQuery = useCallback(debounce(setIterateQuery, delay), []);

  const filteredPeople = useMemo(
    () => {
      return peopleFromServer.filter((person: Person) => (
        person.name.toLowerCase().includes(toNormalizeQuery(iterateQuery))
      ));
    },
    [iterateQuery]
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsShown(true);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    
    setQuery(person.name);
    onSelected(person);
    setIsShown(false);
  };

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query || iterateQuery) {
      setQuery('');
      setIterateQuery(event.target.value);
      applyQuery('');
      setTimeout(() => {
        setIsShown(false);
      }, delay / 2);
    } else {
      setTimeout(() => {
        setIsShown(false);
      }, delay / 2);
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

      {isShown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filteredPeople.length ? (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            ) : (
              filteredPeople.map(person => (
                <a
                  key={person.name}
                  href="/"
                  className={cn('dropdown-item', {
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
