import React, { useContext } from 'react';
import './App.scss';
import { People } from './components/People';
import { PeopleContext } from './contexts/PeopleContexts';
import 'bulma';

export const App: React.FC = () => {
  const { selectedPerson } = useContext(PeopleContext);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson}
      </h1>

      <People />
    </main>
  );
};
