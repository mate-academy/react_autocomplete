import React, {
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { Person } from './types/Person';
import { DropDownMenu } from './components/DropDownMenu';
import { peopleFromServer } from './data/people';
import { filterPersonList } from './services/filterPersonList';

function debounce<T>(
  callback: (arr: T[]) => void,
  delay: number,
  setLoading: (val: boolean) => void,
) {
  let timerId = 0;

  return (arr: T[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(arr);
      setLoading(false);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isThereLoading, setIsThereLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [personListToDisplay, setPersonListToDisplay]
    = useState(peopleFromServer);

  const applyFilteredPersonList
    = useCallback(debounce<Person>(
      setPersonListToDisplay,
      1000,
      setIsThereLoading,
    ), []);

  const handleInput
    = (event: React.FormEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
      setIsThereLoading(true);
      applyFilteredPersonList(filterPersonList(peopleFromServer,
        event.currentTarget.value));
    };

  const handleSelectPerson = (person: Person) => {
    setIsInputFocused(false);
    setSelectedPerson(person);
    setQuery(person.name);
    setPersonListToDisplay([person]);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': isInputFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onInput={handleInput}
            onFocus={() => setIsInputFocused(true)}
          />
          <span
            className="bulma-loader-mixin"
            style={{ display: isThereLoading ? 'block' : 'none' }}
          />
        </div>

        {!isThereLoading && (
          <DropDownMenu
            personList={personListToDisplay}
            selectPerson={handleSelectPerson}
          />
        )}
      </div>
    </main>
  );
};
