import { Person } from '../../types/Person';

type Props = {
  person: Person,
};

export const ChosenPerson: React.FC<Props> = ({ person }) => {
  const { name, born, died } = person;

  return (
    <h1 className="title">
      {`${name} (${born} = ${died})`}
    </h1>
  );
};
