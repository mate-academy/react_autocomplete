import { createContext } from 'react';
import { Person } from '../types/Person';

type PersonContextType = (person: Person) => void;

export const PersonContext = createContext<PersonContextType | null>(null);
