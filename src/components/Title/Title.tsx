import { Date } from '../../types/Date';

interface Props {
  data: Date[];
  isSelected: boolean;
}

export const Title: React.FC<Props> = ({ data, isSelected }) => {
  const { name, born, died } = data[0];

  return (
    <>
      {isSelected ? (
        <h1 className="title">
          {`${name} (${born} = ${died})`}
        </h1>
      ) : (
        <h1 className="title">
          Enter & chose name
        </h1>
      )}
    </>
  );
};
