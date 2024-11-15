import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './components/DropdownMenu';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [title, setTitle] = useState('');
  const [appliedTitle, setAppliedTitle] = useState('');
  const [inputFieldFocus, setInputFieldFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const applyTitle = useCallback(debounce(setAppliedTitle, 300), []);

  const filteredUsers = useMemo(() => {
    return [...peopleFromServer].filter(person =>
      person.name.toLowerCase().includes(appliedTitle.toLowerCase()),
    );
  }, [appliedTitle]);

  function handleTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    applyTitle(event.target.value);
  }

  function handleInputFieldFocus() {
    setInputFieldFocus(true);
  }

  function handleSelectPerson(person: Person) {
    setSelectedPerson(person);
    setInputFieldFocus(false);
    setTitle(person?.name || '');
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      inputRef.current !== event.target &&
      dropdownRef.current !== event.target
    ) {
      setInputFieldFocus(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null || title !== selectedPerson.name
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              value={title}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              ref={inputRef}
              onChange={handleTitle}
              onFocus={handleInputFieldFocus}
            />
          </div>
          {inputFieldFocus && (
            <div ref={dropdownRef}>
              <DropdownMenu
                peopleFromServer={filteredUsers}
                onSelect={handleSelectPerson}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
