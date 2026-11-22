import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Trigger } from './components/Trigger';
import { Menu } from './components/Menu';

import { Person } from './types/Person';

type Props = {
  delay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [title, setTitle] = useState('No selected person');

  const [filteredPeople, setFilteredPeople] = useState([...peopleFromServer]);
  const [hasMatches, setHasMatches] = useState(false);

  const [inputValue, setInputValue] = useState<string>('');

  const [focusInput, setFocusInput] = useState<true | false>(false);

  const [clickOnPerson, setClickOnPerson] = useState<true | false>(true);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setClickOnPerson(true);
    setTitle('No selected person');
  };

  const handleInputFocus = () => {
    setFocusInput(true);
  };

  const handleInputBlur = () => {
    setFocusInput(false);
  };

  const handleSelectedSuggestion = (person: Person) => {
    setClickOnPerson(false);
    setInputValue(person.name);
    setTitle(`${person.name} (${person.born} - ${person.died})`);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (clickOnPerson) {
      timer = setTimeout(() => {
        const value: string = inputValue;
        let currFilteredPeople: Person[] = [...peopleFromServer];

        if (value.trim() !== '') {
          currFilteredPeople = [...peopleFromServer].filter(person =>
            person.name.includes(value.trim()),
          );
        }

        if (currFilteredPeople.length === 0 && value.trim() !== '') {
          setHasMatches(true); //showmessage
        } else if (currFilteredPeople.length !== 0 && clickOnPerson) {
          setHasMatches(false);
        }

        setFilteredPeople(currFilteredPeople);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      return;
    }
  }, [inputValue, delay, clickOnPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className="dropdown is-active">
          <Trigger
            currValue={inputValue}
            onChange={handleInputValue}
            onFocused={handleInputFocus}
            onBlur={handleInputBlur}
          />

          {focusInput && clickOnPerson && !hasMatches && (
            <Menu
              people={filteredPeople}
              onMouseDown={handleSelectedSuggestion}
              onSelected={onSelected}
            />
          )}
        </div>

        {hasMatches && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is - align - self - flex - start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
