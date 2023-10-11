import React from 'react';
import './App.scss';
import { PeopleList } from '../PeopleList/PeopleList';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <PeopleList />
    </div>
  );
};
