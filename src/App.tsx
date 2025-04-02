import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'main',
      { className: 'section is-flex is-flex-direction-column' },
      React.createElement(
        'h1',
        { className: 'title', 'data-cy': 'title' },
        selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person',
      ),
      React.createElement(Autocomplete, {
        people: peopleFromServer,
        onSelected: setSelectedPerson,
      }),
    ),
  );
};
