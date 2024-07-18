import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import DropdownList from './components/dropdownList/DropdownList';
import debounce from 'lodash.debounce';

type ChosenPerson = Person | 'No selected person';

export const App: React.FC = () => {
  const [chosenPerson, setChosenPerson] =
    useState<ChosenPerson>('No selected person');
  const [inputValue, setInputValue] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { name, born, died } = chosenPerson as Person;

  const title =
    typeof chosenPerson === 'object'
      ? `${name} (${born} - ${died})`
      : chosenPerson;

  const applyQuery = useMemo(() => debounce(setAppliedQuery, 300), []);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setInputValue(value);
    applyQuery(value);
    setChosenPerson('No selected person');
  };

  const handleFocusElement = (state: boolean) => {
    setIsFocused(state);
  };

  const handleClick = (person: Person) => {
    setChosenPerson(person);
    handleFocusElement(false);
  };

  const dropdownPersons = useMemo(() => {
    const toEditet = (text: string) => text.toLowerCase().trim();

    return peopleFromServer.filter(person =>
      toEditet(person.name).includes(toEditet(appliedQuery)),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <DropdownList
          people={dropdownPersons}
          onClick={handleClick}
          isFocused={isFocused}
          onFocusElement={handleFocusElement}
          inputValue={inputValue}
          onChangeInput={handleChangeInput}
        />

        {!dropdownPersons.length && (
          <div
            className="
        notification
        is-danger
        is-light
        mt-3
        is-align-self-flex-start
      "
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
