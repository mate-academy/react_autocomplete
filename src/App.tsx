import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [hasClick, setHasClick] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [focus, setFocus] = useState(false);
  const [queryOrPerson, setQueryOrPerson] = useState('');
  const [aplliedQuery, setAplliedQuery] = useState('');

  const serQuery = useCallback(
    debounce(setAplliedQuery, 1000),
    [],
  );

  let copyPeople = [...peopleFromServer];

  if (aplliedQuery) {
    copyPeople = copyPeople.filter(p => {
      const name = p.name.toUpperCase();

      return name.includes(aplliedQuery.toUpperCase());
    });
  }

  useEffect(() => setFocus(false), [person, hasClick]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryOrPerson(event.currentTarget.value);
    serQuery(event.currentTarget.value);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>, p: Person,
  ) => {
    event.preventDefault();
    setQueryOrPerson(p.name);
    setHasClick(!hasClick);
    setPerson(p);
  };

  return (
    <main className="section">
      {person && queryOrPerson ? (
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
            {copyPeople.map(p => (
              <a
                onClick={(event) => handleClick(event, p)}
                href={`#${p.slug}`}
                key={p.slug}
                className="dropdown-item"
              >
                <p
                  className={`has-text-${p.sex === 'f' ? 'danger' : 'link'}`}
                >
                  {p.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
