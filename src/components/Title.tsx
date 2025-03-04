import { Person } from '../types/Person';

interface Props {
  choice: Person | null;
}

const Title: React.FC<Props> = ({ choice }) => {
  let title = 'No selected person';

  if (choice !== null) {
    const { name, born, died } = choice;

    title = `${name} (${born} - ${died})`;
  }

  return (
    <h1 className="title" data-cy="title">
      {title}
    </h1>
  );
};

export default Title;
