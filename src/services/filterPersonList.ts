import { Person } from '../types/Person';

export const filterPersonList
  = (personList: Person[], query: string) : Person[] => {
    return personList.filter(person => person.name
      .toLowerCase().includes(query.toLowerCase()));
  };
