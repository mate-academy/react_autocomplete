import React from 'react';
import { Person } from './types/Person';

interface AppContextType {
  personName: string,
  setPersonName: (query: string) => void,
  applyQuery: (query: string) => void,
  handleClick: (selectedPerson: string) => void,
  filteredPeople: Person[],
}

export const AppContext = React.createContext<AppContextType>({
  personName: '',
  setPersonName: () => {},
  applyQuery: () => { },
  handleClick: () => { },
  filteredPeople: [],
});
