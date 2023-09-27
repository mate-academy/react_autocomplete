import React from 'react';
import { Person } from '../types/Person';

interface PeopleContextType {
  personName: string,
  setPersonName: (query: string) => void,
  applyQuery: (query: string) => void,
  handleClick: (selectedPerson: string) => void,
  filteredPeople: Person[],
}

export const PeopleContext = React.createContext<PeopleContextType>({
  personName: '',
  setPersonName: () => {},
  applyQuery: () => { },
  handleClick: () => { },
  filteredPeople: [],
});
