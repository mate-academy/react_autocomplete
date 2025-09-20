import { Person } from '../../types/Person';

interface Props {
  selectedPerson: Person | string;
}

export const SelectedPerson: React.FC<Props> = ({ selectedPerson }) => {
  return typeof selectedPerson === 'string' ? (
    <h1 className="title" data-cy="title">
      {`No selected person`}
    </h1>
  ) : (
    <h1 className="title" data-cy="title">
      {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
    </h1>
  );
};
