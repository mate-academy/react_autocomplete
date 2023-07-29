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
  const [querry, setQuerry] = useState('');
  const [appliedQuerry, setAppliedQuerry] = useState('');
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const choosePerson = useCallback((newPerson: Person) => {
    setSelectedPerson(newPerson);
    setIsDropdownFocus(false);
    setAppliedQuerry(newPerson.name.toString());
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPerson(null);
    setQuerry('');
    setAppliedQuerry('');
  }, []);

  const visablePeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name
        .toLowerCase().includes(appliedQuerry.toLowerCase()));
  }, [appliedQuerry, peopleFromServer]);

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
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
          querry={querry}
          onQuerry={setQuerry}
          onAppliedQuerry={setAppliedQuerry}
          selectedPerson={selectedPerson}
          onDropdownFocus={setIsDropdownFocus}
        />

        <button
          aria-label="Close dropdown"
          onClick={() => setIsDropdownFocus(false)}
          type="button"
          className={cn(
            'button_hidden delete is-medium',
            { 'is-hidden': selectedPerson || !isDropdownFocus },
          )}
        />

        <DropdownMenu
          people={visablePeople}
          onSelectedPerson={choosePerson}
          onQuerry={setQuerry}
        />
      </div>
    </main>
  );
};
