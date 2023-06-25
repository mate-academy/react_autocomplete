import { createContext } from 'react';
import { Person } from '../../types/Person';

export interface ContextType {
  setSelectMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  preparedPeople: Person[];
  applyFilterQuery: (...args: string[]) => void;
}

export const DropdownDataContext = createContext<ContextType | null>(null);
