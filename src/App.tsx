import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { Autocomplete } from './components/Autocomplete';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 500 }) => {
  const [isActive, setIsActive] = useState(false);
  const [inputField, setInputField] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visiableContent, setVisiableContent] = useState(peopleFromServer);

  const filterContent = useCallback((inputValue: string) => {
    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase().trim()),
    );

    setVisiableContent(filtered);
    setIsActive(filtered.length > 0);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilter = useCallback(debounce(filterContent, delay), [
    filterContent,
    delay,
  ]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputField(e.target.value);
    debounceFilter(e.target.value);
    setSelectedPerson(null);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setIsActive(false);
    setInputField(person.name);
  };

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : `No selected person`;

  const handleIsActive = (value: boolean) => {
    setIsActive(value);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <Autocomplete
          people={visiableContent}
          selectedPerson={selectedPerson}
          visiable={isActive}
          inputText={inputField}
          onType={inputChange}
          onSelect={handleSelect}
          onChange={handleIsActive}
        />

        {!visiableContent.length && (
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
