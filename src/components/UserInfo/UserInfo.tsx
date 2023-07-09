import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  user: Person,
};

export const UserInfo: React.FC<Props> = ({ user }) => (
  <p className={cn({
    'has-text-link': user.sex === 'm',
    'has-text-danger': user.sex === 'f',
  })}
  >
    {user.name}
  </p>
);
