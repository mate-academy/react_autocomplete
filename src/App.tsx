import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownList } from './Components/DrowdownList/DrowdownList';

const debounce = <T extends (...args: never[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isVisibleSuggestion, setIsVisibleSuggestion] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [appliedQuery],
  );

  const visiblePeople = useMemo(() => {
    if (!appliedQuery) {
      return [];
    }

    setIsVisibleSuggestion(true);

    return peopleFromServer.filter(person => {
      const nameNormalize = person.name.toLowerCase();
      const searchQueryNormalize = appliedQuery.toLowerCase().trim();

      return nameNormalize.includes(searchQueryNormalize);
    });
  }, [peopleFromServer, appliedQuery]);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsVisibleSuggestion(false);
    setSearchQuery('');
    setAppliedQuery('');
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;

    setSearchQuery(inputValue);
    applyQuery(inputValue);
    setIsVisibleSuggestion(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div
        className={cn('dropdown', {
          'is-active': isVisibleSuggestion,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>

        {isVisibleSuggestion && (
          <DropdownList
            handlePersonSelect={handlePersonSelect}
            people={visiblePeople}
          />
        )}
      </div>
    </main>
  );
};
