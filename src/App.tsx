import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropDownMenu } from './components/DropDownMenu/DropDownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isSugActive, setIsSugActive] = useState(false);

  const visiblePeople = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    setIsSugActive(!!normalizedQuery);

    if (!normalizedQuery) {
      setSelectedPerson(null);
    }

    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(normalizedQuery)
    ));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleSelect = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
    status: boolean,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setQuery(person.name);
    setIsSugActive(status);
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = event.target.value;

    setQuery(searchInput);
    applyQuery(searchInput);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
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
        <DropDownMenu onSelect={handleSelect} visiblePeople={visiblePeople} />
      </div>
    </main>
  );
};
