/* eslint-disable no-console */
import React, { useContext } from 'react';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import {
  AutocompleteStateContext,
  AutocompleteDispatchContext,
  AutocompleteActions,
} from '../Autocomplete/AutocompleteContext';
import { Person } from '../../types/Person';

export const PeopleList: React.FC = () => {
  console.log('Rendering PeopleList');

  const dispatch = useContext(AutocompleteDispatchContext);
  const { selectedPerson } = useContext(AutocompleteStateContext);

  const handleSelection = (person: Person) => {
    console.log('Selected person:', person);

    // Dispatch the SelectPerson action to update the context
    dispatch({
      type: AutocompleteActions.SelectPerson,
      payload: person,
    });
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'Select a person'}
      </h1>
      <Autocomplete debounceDelay={300} onSelected={handleSelection} />
    </main>
  );
};

export default PeopleList;
