/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef, useState } from 'react';
import './App.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visibleList, setVisibleList] = useState(false);

  const { name, born, died } = selectedPerson || {};

  const textField = useRef<HTMLInputElement>(null);

  // #region Query
  const applyQuery = useCallback(debounce(setAppliedQuery, 500), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setVisibleList(true);
  };

  // #endregion

  const filteredPeople = peopleFromServer.filter(
    (person) => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const handleBlur = () => {
    setTimeout(() => {
      setVisibleList(false);
    }, 100);
  };

  // #region Person
  const handleResetPerson = () => {
    setQuery('');
    setAppliedQuery('');
    setSelectedPerson(null);
  };

  const handlePersonSelection = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setSelectedPerson(person);
    setVisibleList(false);

    if (textField.current) {
      textField.current.focus();
    }
  };
  // #endregion

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${name} (${born} = ${died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger control has-icons-right">
          <input
            type="text"
            ref={textField}
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleChangeQuery}
            onClick={() => setVisibleList(true)}
            onBlur={handleBlur}
          />
          {selectedPerson && (
            <span className="icon is-small is-right">
              <button
                onClick={handleResetPerson}
                type="button"
                className="delete is-small"
              >
                x
              </button>
            </span>
          )}
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          style={{
            display: visibleList ? 'block' : 'none',
          }}
        >
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => {
                return (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    onClick={() => {
                      handlePersonSelection(person);
                    }}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
