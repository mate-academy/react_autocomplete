import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropDown } from './dropDowm/dropDown';

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
  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');
  const [isSugActive, setIsSugActive] = useState(false);

  const visiblePeople = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    if (appliedQuery) {
      setIsSugActive(true);
    }

    if (!appliedQuery) {
      setSelectedPersonSlug('');
      setIsSugActive(false);
    }

    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(normalizedQuery)
    ));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const selectedPerson = visiblePeople.find(person => (
    person.slug === selectedPersonSlug
  ));

  const handleSelect = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    personSlug: string,
    personName: string,
    status: boolean,
  ) => {
    event.preventDefault();
    setSelectedPersonSlug(personSlug);
    setQuery(personName);
    setIsSugActive(status);
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPersonSlug
          ? `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown',
        { 'is-active': isSugActive === true })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInput}
          />
        </div>
        <DropDown onSelect={handleSelect} visiblePeople={visiblePeople} />
      </div>
    </main>
  );
};
