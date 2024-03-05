import debounce from 'lodash.debounce';
import React, { useMemo, useState } from 'react';
import { List } from './list';
import { Notifications } from './notification';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectPerson: (person: Person | null) => void;
  selectedPerson: Person | null;
};

export const Form: React.FC<Props> = ({
  people,
  selectPerson,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showAllPeople, setShowAllPeople] = useState(false);

  const applyQuery = debounce(setAppliedQuery, 300);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setShowAllPeople(false);
    setAppliedQuery('');
    selectPerson(null);
  };

  const handleFullListOfPeople = () => {
    setShowAllPeople(true);
  };

  const handleBlurFullListOfPeople = () => {
    setShowAllPeople(false);
  };

  const delayedBlur = debounce(handleBlurFullListOfPeople, 300);

  const onSelect = (person: Person) => {
    selectPerson(person);
    setQuery(person.name);
    applyQuery(person.name);
    setShowAllPeople(false);
    setAppliedQuery('');
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const checkingForFullList =
    (showAllPeople || appliedQuery) &&
    filteredPeople.length > 0 &&
    !selectedPerson;

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFullListOfPeople}
            onBlur={delayedBlur}
          />
        </div>
        {checkingForFullList && (
          <List onSelect={onSelect} people={filteredPeople} />
        )}
      </div>

      {filteredPeople.length === 0 && <Notifications />}
    </>
  );
};
