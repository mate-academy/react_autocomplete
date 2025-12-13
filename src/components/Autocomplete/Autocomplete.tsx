import { Person } from '../../types/Person';

type Props = {
  person: Person | null;
};

export const Autocomplete: React.FC<Props> = ({ person }) => {
  if (!person) {
    return (
      <h1 className="title" data-cy="title">
        No selected person
      </h1>
    );
  }

  const { name, born, died } = person;

  return (
    <h1 className="title" data-cy="title">
      {`${name} (${born} - ${died})`}
    </h1>
  );
};
