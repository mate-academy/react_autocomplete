/* eslint-disable */
import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

interface Props {
  selected: Person | undefined;
  setSelected: (person: Person) => void;

}

export const Autofill: React.FC<Props> = ({ selected, setSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQueyry, setAppliedQuery] = useState('');
  const [active, setActive] = useState(false);

  function handleSelected(person: Person) {
    setSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setActive(true);
  }

  const applyQuery = useCallback(
    debounce((value) => {
      setAppliedQuery(value);
      setActive(true);
    }, 1000),
    [],
  );

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setActive(false);
  }

  const preparedPeople = peopleFromServer.filter(
      person => person.name.toLowerCase().includes(
        appliedQueyry.trim().toLowerCase(),
      ),
    );

  const handleInputFocus = () => {
    setActive(true);
  };

  const handleInputBlur = () => {
    setActive(false);
  };

  return (

    <main className="section">

          <h1 className="title">
            {
              selected
                ? (`${selected?.name} (${selected?.born} - ${selected?.died})`)
                : ('No selected person')
            }
          </h1>



      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
        {active
          && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {
                  preparedPeople.length ? (
                    preparedPeople.map(person => (
                      <div className="dropdown-item" key={person.slug}>
                        <p
                          className={cn('has-text-link', {
                            'has-text-danger': person.sex === 'f',
                          })}
                          onMouseDown={() => handleSelected(person)}
                        >
                          {person.name}
                        </p>
                      </div>
                    )))
                    : (
                      <div className="dropdown-item">
                        <p>
                          No matches
                        </p>
                      </div>
                    )
                }
              </div>
            </div>
          )}
      </div>
    </main>
  );
};
