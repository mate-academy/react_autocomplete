import { Person } from '../../types/Person';

type Props = {
  user: Person | null,
};

export const UserInfo: React.FC<Props> = ({ user }) => (
  (user ? (
    <h1 className="title">
      {`${user.name} (${user.born} = ${user.died})`}
    </h1>
  ) : (
    <h1 className="title">No selected person</h1>
  ))
);
