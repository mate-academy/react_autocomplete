import React from 'react';
import { Person } from '../types/Person';

interface PeopleContextI {
  people: Person[];
  selectedPerson: Person | null;
  onSelect: (slug: string | null) => void;
}

export const PeopleContext = React.createContext<PeopleContextI>({
  people: [],
  selectedPerson: null,
  onSelect: () => {},
});
