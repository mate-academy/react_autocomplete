import React, { useState } from 'react';
import './App.scss';
import { AutoComplete } from './components/Autocomplete/Autocomplete';
import { Person } from './types/Person';


export const App: React.FC = () => {
  const [selectedOne, setSelectedOne] = useState<Person | ''>('');
  const [notification, setNotification] = useState(false);
  const widthDropdown = 300;
  const delay = 500;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
        {selectedOne
            ? `${selectedOne.name} (${selectedOne.born} - ${selectedOne.died})`
            : 'No selected person'}
        </h1>

        <AutoComplete
          onSelected={setSelectedOne}
          delay={delay}
          width={widthDropdown}
          onWarning={a => setNotification(a)}
        />

        {notification && (
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
