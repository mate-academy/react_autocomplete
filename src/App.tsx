import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomlete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Person | null>(null);
  const [showError, setShowError] = useState(false);

  const handleNoMatchingSuggestions = (hasError: boolean) => {
    setShowError(hasError);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected && selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <Autocomlete
          people={peopleFromServer}
          delay={300}
          onSelected={setSelected}
          select={selected}
          onNoMatchingSuggestions={handleNoMatchingSuggestions}
        />
        {showError && (
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
