import React, {
  useCallback, useMemo, useState,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { DropdownForm } from './components/DropdownForm/DropdownForm';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  // const { name, born, died } = selectedPerson;
  const debounceTimer = 1000;

  const choosePerson = useCallback((newPerson: Person) => {
    setSelectedPerson(newPerson);
    setIsDropdownFocus(false);
    setAppliedQuery(newPerson.name.toString());
  }, []);

  const handleQueryReset = useCallback(() => {
    setQuery('');
    setAppliedQuery('');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPerson(null);
    handleQueryReset();
  }, []);

  const handleInputReset = useCallback(() => {
    setIsDropdownFocus(false);
    handleQueryReset();
  }, []);

  const visablePeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name
        .toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    // ? `${name} (${born} - ${died})`
    : 'No matching suggestions';

  return (
    <main className="section">
      <h1 className="title">
        {title}
        <button
          aria-label="Reset information"
          onClick={handleReset}
          type="button"
          className={cn(
            'button_delete delete is-medium',
            { 'is-hidden': !selectedPerson },
          )}
        />
      </h1>

      <div
        className={cn('dropdown', { 'is-active': isDropdownFocus })}
      >
        <DropdownForm
          query={query}
          onQuery={setQuery}
          onAppliedQuery={setAppliedQuery}
          selectedPerson={selectedPerson}
          onDropdownFocus={setIsDropdownFocus}
          debounceTimer={debounceTimer}
        />

        <button
          aria-label="Close dropdown"
          onClick={handleInputReset}
          type="button"
          className={cn(
            'button_hidden delete is-medium',
            { 'is-hidden': !query.length },
          )}
        />

        <DropdownMenu
          people={visablePeople}
          onSelectedPerson={choosePerson}
          onQuery={setQuery}
        />
      </div>
    </main>
  );
};
