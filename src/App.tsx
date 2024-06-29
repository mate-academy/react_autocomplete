import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/dropdown/dropdown';

export const App: React.FC = () => {
  const [peopleList, setPeopleList] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isShowList, setIsShowList] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const changeSelectedPerson = (person: Person) => {
    setIsShowList(false);
    setInputValue(person.name);
    setSelectedPerson(person);
  };

  const filteringPeopleList = (value: string) => {
    setInputValue(value);

    if (selectedPerson && selectedPerson.name !== value) {
      setSelectedPerson(null);
    }

    if (value.trimStart()) {
      setPeopleList(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );

      return;
    }

    setSelectedPerson(null);
    setPeopleList(peopleFromServer);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          people={peopleList}
          value={inputValue}
          showList={isShowList}
          onIsShowList={setIsShowList}
          onFilteringPeopleList={filteringPeopleList}
          onChangeSelPerson={changeSelectedPerson}
        />

        {peopleList.length === 0 && (
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
