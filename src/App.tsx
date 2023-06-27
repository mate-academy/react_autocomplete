import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';

const debounce = (
  f: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) => {
  let timerId: number;

  return (...args: string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [personName, setPersonName] = useState<string | null>(null);
  const [dropdownRegulator, setDropdownRegulator] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const selectedPerson = peopleFromServer
    .find(user => user.name === personName);

  const matchedPersons = useMemo(() => {
    setDropdownRegulator(true);

    return peopleFromServer.filter(person => {
      const queryNormalize = appliedQuery.toLowerCase();

      return person.name.toLowerCase().includes(queryNormalize);
    });
  }, [appliedQuery]);

  const handlePersonClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const currentName = event.currentTarget.textContent || '';

    setPersonName(currentName);
    setQuery(currentName);
    setDropdownRegulator(false);
  };

  const handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    applyQuery(event.currentTarget.value);
    setDropdownRegulator(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <div
        className={cn('dropdown', {
          'is-active': query,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        {
          // eslint-disable-next-line max-len
          dropdownRegulator && <DropdownMenu persons={matchedPersons} onClick={handlePersonClick} />
        }
      </div>
    </main>
  );
};
