import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { debounce } from 'lodash';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [hasClick, setHasClick] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [aplliedQuery, setAplliedQuery] = useState('');

  const queryDetention = useCallback(
    debounce((newQuery: string) => setAplliedQuery(newQuery), 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    if (!aplliedQuery) {
      return peopleFromServer;
    }

    const normalizedQuery = aplliedQuery.toUpperCase();

    return peopleFromServer.filter(currentPerson => {
      const name = currentPerson.name.toUpperCase();

      return name.includes(normalizedQuery);
    });
  }, [aplliedQuery]);

  useEffect(() => setFocus(false), [person, hasClick]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.currentTarget.value;

    setQuery(newQuery);
    queryDetention(newQuery);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    currentPerson: Person,
  ) => {
    event.preventDefault();
    setQuery(currentPerson.name);
    setHasClick(!hasClick);
    setPerson(currentPerson);
    setFocus(false);
  };

  return (
    <main className="section">
      {visiblePeople.length !== 0 && person && query ? (
        <h1 className="title">
          {`${person.name} (${person.born} - ${person.died})`}
        </h1>
      ) : (
        <h1 className="title">No matching suggestions</h1>
      )}

      <div className={`dropdown ${focus && 'is-active'}`}>
        <div className="dropdown-trigger">
          <input
            value={query}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length !== 0 ? (
              visiblePeople.map(currentPerson => (
                <a
                  onMouseDown={(event) => handleClick(event, currentPerson)}
                  href={`#${currentPerson.slug}`}
                  key={currentPerson.slug}
                  className="dropdown-item"
                >
                  <p
                    className={`has-text-${
                      currentPerson.sex === 'f' ? 'danger' : 'link'
                    }`}
                  >
                    {currentPerson.name}
                  </p>
                </a>
              ))
            ) : (
              <p className="subtitle is-6">No matching suggestions</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
