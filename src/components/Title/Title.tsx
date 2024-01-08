import { Person } from '../../types/Person';

type Props = {
  person: Person | null;
  title: string;
};

export const Title:React.FC<Props> = ({ person, title }) => {
  return (
    <h1 className="title">
      {title.length === 0 ? (
        'No selected person'
      ) : (
        `${person?.name} (${person?.born} - ${person?.died})`
      )}
    </h1>
  );
};
