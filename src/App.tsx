import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { DropdownContent } from './components/DropdownContent';
import { Person } from './types/Person';

type Prop = {
  delay: number,
};

export const App: React.FC<Prop> = ({ delay = 1000 }) => {
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [people, setPeople] = useState<Person>();
  const applyQuery = useCallback(
    debounce(setApliedQuery, delay),
    [],
  );
  const onSelected = (newPeople: Person) => {
    const {
      name, sex, born, died, fatherName, motherName, slug,
    } = newPeople;

    setQuery(name);
    setPeople({
      name, sex, born, died, fatherName, motherName, slug,
    });
    setIsActive(false);
  };

  const filtered = useMemo(() => {
    return peopleFromServer
      .filter(filteredPeople => filteredPeople.name.toLowerCase()
        .includes(apliedQuery.toLowerCase()));
  }, [peopleFromServer, apliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {people === undefined
          ? 'No selected person'
          : `${people.name} (${people.born} = ${people.died})`}
      </h1>

      <div
        className={`dropdown ${isActive
          ? 'is-active'
          : ''}`}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
              setIsActive(true);
            }}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
        >
          {filtered.length === 0
            ? 'No matching suggestions'
            : (
              <DropdownContent
                peoples={filtered}
                onSelected={onSelected}
              />
            )}
        </div>
      </div>
    </main>
  );
};
