import { Person } from '../types/Person';

export function showSelectedPersonInfo(selectedPerson: Person | null) {
  if (selectedPerson) {
    const { name, born, died } = selectedPerson;

    return `${name} (${born} - ${died})`;
  }

  return 'No selected person';
}
