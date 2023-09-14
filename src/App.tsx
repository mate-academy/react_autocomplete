/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay: number,
};

export const App: React.FC<Props> = ({ delay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [textField, setTextField] = useState<string>('');
  const [fieldFocused, setFieldFocused] = useState<boolean>(false);
  const [filteredPeople, setFilteredPeople]
  = useState<Person[] | []>(peopleFromServer);

  useMemo(() => {
    if (peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(textField.toLowerCase())).length > 0) {
      setTimeout(() => setFilteredPeople(peopleFromServer
        .filter(person => person
          .name.toLowerCase().includes(textField.toLowerCase()))), delay);
    } else {
      setFilteredPeople([]);
    }
  }, [textField]);

  return (
    <main className="section">
      {selectedPerson && (
        <div style={{
          display: 'flex',
          gap: '20px',
        }}
        >
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
          </h1>
          <button
            type="button"
            className="delete is-medium"
            onClick={() => {
              setSelectedPerson(null);
              setTextField('');
            }}
          />
        </div>

      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={(e) => setTextField(e.target.value.trim())}
            value={textField}
            onFocus={() => setFieldFocused(true)}
            onBlur={() => setTimeout(() => setFieldFocused(false), 150)}

          />
        </div>

        <div className="dropdown-menu" role="menu">
          {fieldFocused && (
            <div className="dropdown-content">

              {filteredPeople.length > 0
                ? filteredPeople.map(person => {
                  return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      onClick={() => setSelectedPerson(person)}
                    >
                      <p className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      >
                        {person.name}

                      </p>
                    </div>
                  );
                })
                : <p className="dropdown-item">No matching suggestions</p>}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
