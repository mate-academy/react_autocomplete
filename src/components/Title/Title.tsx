import { Person } from '../../types/Person';

type Props = {
  person: Person | null;
};

export const Title:React.FC<Props> = ({ person }) => (
  <h1 className="title">
    {person ? (
      `${person.name} (${person.born} - ${person.died})`
    ) : (
      'No selected person'
    )}
  </h1>
);
