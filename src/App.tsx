import './App.scss';
import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/DropdownList';
import { debounce } from './debounce';

export const App: React.FC = () => {
  const [people] = useState(peopleFromServer);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isSuggestions, setIsSuggestions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const { name, born, died } = selectedPerson ?? {};

  const preparedSearchQuery = searchQuery.toLowerCase().trim();

  const visiblePeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(preparedSearchQuery),
    );
  }, [appliedQuery, people]);

  const onSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setSearchQuery(person.name);
    setIsSuggestions(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setSearchQuery(event.target.value);
    setIsSuggestions(event.target.value !== '');

    if (isSuggestions) {
      setSelectedPerson(null);
    }
  };

  const handlClearButton = () => {
    setSearchQuery('');
    setIsSuggestions(false);
    setSelectedPerson(null);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} - ${died})`
          : 'No selected person'}

      </h1>

      <div className={cn('dropdown',
        { 'is-active': isSuggestions })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="icon">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              onClick={handlClearButton}
            />
          </span>

        </div>
        <Dropdown
          selectPerson={onSelectPerson}
          people={visiblePeople}
        />
      </div>
    </main>
  );
};
