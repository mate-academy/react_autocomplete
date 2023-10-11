import React, { useContext } from 'react';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { AutocompleteStateContext } from '../Autocomplete/AutocompleteContext';

export const PeopleList: React.FC = () => {
  const { selectedPerson } = useContext(AutocompleteStateContext);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'Select a person'}
      </h1>
      <Autocomplete debounceDelay={300} />
    </main>
  );
};

export default PeopleList;
