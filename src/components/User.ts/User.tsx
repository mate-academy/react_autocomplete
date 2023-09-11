import { FC } from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';

type TUserProps = {
  user: Person;
  handleUserSelect: (userSlug: Person) => void;
};

export const User: FC<TUserProps> = ({
  user,
  handleUserSelect = () => { },
}) => (
  <button
    type="button"
    className={
      cn(
        'button',
        'is-info',
        'is-outlined',
        'is-fullwidth',
        'mb-1',
        {
          'has-text-link': user.sex === 'm',
          'has-text-danger': user.sex === 'f',
        },
      )
    }
    onClick={() => handleUserSelect(user)}
  >
    {user.name}
  </button>
);
