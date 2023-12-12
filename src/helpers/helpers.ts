import { SetAutoComplList } from '../types/Person';
import { peopleFromServer } from '../data/people';

export const setAutocompleteList: SetAutoComplList = (
  people,
  query,
) => {
  if (query === '') {
    return [...peopleFromServer];
  }

  return people.filter(({ name }) => {
    return name.toLowerCase().includes(query.toLowerCase());
  });
};
