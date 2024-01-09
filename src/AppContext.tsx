import React from 'react';
import { Person } from './types/Person';

type AppType = {
  personName: string,
  setPersonName: (query: string) => void,
  appliedQuery: (query: string) => void,
  handleClick: (selectedPerson: string) => void,
  filterPeople: Person[],
};

export const AppContext = React.createContext<AppType>({
  personName: '',
  setPersonName: () => {},
  appliedQuery: () => { },
  handleClick: () => { },
  filterPeople: [],
});
