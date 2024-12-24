import React from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Content } from './Content';

export const App: React.FC = () => {
  return (
    <div className="container">
      <Content
        peopleFromServer={peopleFromServer}
        debounce={debounce}
        delay={300}
      />
    </div>
  );
};
