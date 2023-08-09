import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [hasClick, setHasClick] = useState<boolean>(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [focus, setFocus] = useState<boolean>(false);
  const [queryOrPerson, setQueryOrPerson] = useState<string>('');
  const [aplliedQuery, setAplliedQuery] = useState<string>('');

  const serQuery = useCallback(
    debounce(setAplliedQuery, 1000),
    [],
  );

  let copyPeople = [...peopleFromServer];

  if (aplliedQuery) {
    copyPeople = copyPeople.filter(man => {
      const name = man.name.toUpperCase();

      return name.includes(aplliedQuery.toUpperCase());
    });
  }

  useEffect(() => setFocus(false), [person, hasClick]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryOrPerson(event.currentTarget.value);
    serQuery(event.currentTarget.value);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>, man: Person,
  ) => {
    event.preventDefault();
    setQueryOrPerson(man.name);
    setHasClick(!hasClick);
    setPerson(man);
  };

  return (
    <main className="section">
      {copyPeople.length && person && queryOrPerson ? (
        <h1 className="title">{`${person.name} (${person.born} - ${person.died})`}</h1>
      ) : (
        <h1 className="title">No matching suggestions</h1>
      )}

      <div className={`dropdown ${focus && 'is-active'}`}>
        <div className="dropdown-trigger">
          <input
            value={queryOrPerson}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {copyPeople.map(man => (
              <a
                onClick={(event) => handleClick(event, man)}
                href={`#${man.slug}`}
                key={man.slug}
                className="dropdown-item"
              >
                <p
                  className={`has-text-${man.sex === 'f' ? 'danger' : 'link'}`}
                >
                  {man.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
