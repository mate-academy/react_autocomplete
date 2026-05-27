import { Person } from '../../types/Person';

type Props = {
  person: Person | null;
};

export const Title: React.FC<Props> = ({ person }) => {
  return (
    <h1 className="title" data-cy="title">
      {person
        ? `${person.name} (${person.born} - ${person.died})`
        : 'No selected person'}
    </h1>
  );
};
