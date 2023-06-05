import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import debounce from 'lodash/debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

interface PeopleContextType {
  input: string,
  setInput: (query: string) => void,
  applyQueryWithDebounce: (query: string) => void,
  filteredPeople: Person[],
  selectedPerson: string,
  handleClick: (person: string) => void,
}

const PeopleContext = createContext<PeopleContextType>({} as PeopleContextType);

export const PeopleProvider:
React.FC<{ children: ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[] | null>(peopleFromServer);
  const [input, setInput] = useState<string>('');
  const [selectedPerson, setSelectedPerson]
    = useState<string>('No person is selected');

  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const applyQueryWithDebounce = useCallback(
    debounce(setAppliedQuery, 1000), [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleClick = useCallback((person: string) => {
    setSelectedPerson(person);
    setPeople([]);
    setInput('');
  }, []);

  return (
    <PeopleContext.Provider
      value={{
        input,
        setInput,
        applyQueryWithDebounce,
        selectedPerson,
        filteredPeople,
        handleClick,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export { PeopleContext };
