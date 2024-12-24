import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Notification } from './Notification';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  return (
    <div className="container">
      <Notification
        peopleFromServer={peopleFromServer}
        debounce={debounce}
        delay={300}
      />
    </div>
  );
};
