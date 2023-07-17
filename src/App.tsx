import React, { useState, useEffect } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [text, setText] = useState('');
  const [person, setPerson] = useState<Person | null>();
  const [search, setSearch] = useState(false);
  const [same, setSame] = useState<Person[]>([]);

  const searchMethod = (value: string) => {
    setSearch(false);
    setTimeout(() => {
      const filtered = peopleFromServer
        .filter((item) => {
          const itemName = item.name.toLowerCase();

          return (
            itemName.includes(value.toLowerCase())
          );
        });

      setSame(filtered);
      setSearch(true);
    }, 1000);
  };

  useEffect(() => {
    if (text !== '') {
      searchMethod(text);
    } else {
      setSame([]);
      setPerson(null);
    }
  }, [text]);

  return (
    <main className="section">
      <h1 className="title">
        { person
          ? `${person.name} (${person.born} = ${person.died})`
          : 'No matching suggestions'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div
            className={classNames('dropdown-content',
              { 'not-visible': text === '' },
              { 'is-visible': search === false })}
          >
            { search && (
              same.map((pers) => {
                return (
                  <div
                    className="dropdown-item"
                    style={{ cursor: 'pointer' }}
                    key={pers.name}
                    aria-hidden="true"
                    onClick={() => {
                      setPerson(pers);
                    }}
                  >
                    <p
                      className={classNames(
                        { 'has-text-danger': pers === person },
                        { 'has-text-link': pers !== person },
                      )}
                    >
                      {pers.name}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
