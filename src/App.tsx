import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Search } from './components/Search.';
import { Notification } from './components/Notification';
import { Title } from './components/Title';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const onSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const onChange = () => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Title selectedPerson={selectedPerson} />
        <Search
          allPeople={peopleFromServer}
          onSelected={onSelected}
          isSelectedPerson={!!selectedPerson}
          onChange={onChange}
        />
        {!isFirstRender && !selectedPerson && <Notification />}
      </main>
    </div>
  );
};
