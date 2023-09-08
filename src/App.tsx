import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './components/DropDown';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {currentUser
          ? `${currentUser.name} (${currentUser.born} - ${currentUser.died})`
          : 'No selected person'}
      </h1>
      <DropDown
        people={peopleFromServer}
        onSelected={setCurrentUser}
        delay={DELAY}
      />
    </main>
  );
};
