import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import debounce from 'lodash/debounce';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

interface PeopleContextType {
  input: string;
  setInput: (query: string) => void;
  applyQueryWithDebounce: (query: string) => void;
  handleClick: (person: string) => void;
  filteredPeople: Person[];
  selectedPerson: string;
}

const PeopleContext = createContext<PeopleContextType>({} as PeopleContextType);

export const PeopleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [people, setPeople] = useState<Person[] | null>(peopleFromServer);
  const [input, setInput] = useState<string>('');
  const [selectedPerson, setSelectedPerson]
    = useState<string>('No Person is selected');
  const [appliedQuery, setAppliedQuery] = useState<string>('');

  const applyQueryWithDebounce = useCallback(
    debounce(setAppliedQuery, 500), [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => person.name
      .toLowerCase()
      .includes(appliedQuery.toLowerCase()));
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
        handleClick,
        filteredPeople,
        selectedPerson,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
