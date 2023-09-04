import React from 'react';
import { Person } from '../../types/Person';
import { AutocompleteItem } from '../AutocompleteItem';

type Props = {
  suggestedPeople: Person[],
  handleSelect: (person: Person) => void,
};

export const AutocompleteList: React.FC<Props> = React.memo(({
  suggestedPeople,
  handleSelect,
}) => (
  <>
    {
      suggestedPeople.map(person => (
        <AutocompleteItem
          person={person}
          handleSelect={handleSelect}
          key={person.slug}
        />
      ))
    }
  </>
));
