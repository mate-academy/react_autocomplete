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
  message: string,
  handleClick: (person: Person) => void,
}

const PeopleContext = createContext<PeopleContextType>({} as PeopleContextType);
const defaultMessage = 'No person is selected';

export const PeopleProvider:
React.FC<{ children: ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[] | null>(peopleFromServer);
  const [input, setInput] = useState<string>('');
  const [message, setMessage] = useState<string>(defaultMessage);

  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const applyQueryWithDebounce = useCallback(
    debounce(setAppliedQuery, 1000), [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleClick = useCallback((person: Person) => {
    const resultMessage = `${person.name} (${person.born} = ${person.died})`;

    setMessage(resultMessage);
    setPeople([]);
    setInput('');
  }, []);

  return (
    <PeopleContext.Provider
      value={{
        input,
        setInput,
        applyQueryWithDebounce,
        message,
        filteredPeople,
        handleClick,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export { PeopleContext };
